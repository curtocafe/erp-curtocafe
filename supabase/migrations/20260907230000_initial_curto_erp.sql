-- Curto ERP: núcleo inicial conversacional (Supabase/PostgreSQL)
-- Fonte de verdade: schema versionado; escrita de negócio somente via RPC Invokta.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type public.idioma_codigo as enum ('pt-BR', 'es-PY');
create type public.perfil_acesso as enum ('GESTOR', 'OPERADOR', 'FORNECEDOR');
create type public.unidade_codigo as enum ('UN', 'KG', 'PCT', 'L');
create type public.tipo_movimentacao as enum ('ENTRADA', 'SAIDA_CONSUMO', 'PERDA_AVARIA', 'AJUSTE_INVENTARIO');
create type public.origem_canal as enum ('WHATSAPP_AUDIO', 'WHATSAPP_FOTO', 'WHATSAPP_TEXTO');

create table public.unidades (
  id uuid primary key default gen_random_uuid(),
  nome varchar(120) not null,
  pais char(2) not null check (pais in ('BR', 'PY')),
  moeda char(3) not null check (moeda in ('BRL', 'PYG', 'USD')),
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  unique (nome, pais)
);

create table public.usuarios (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  nome varchar(120) not null,
  telefone_whatsapp varchar(25) not null unique,
  email varchar(120),
  idioma_preferencial public.idioma_codigo not null default 'pt-BR',
  perfil_acesso public.perfil_acesso not null default 'OPERADOR',
  permissao_financeira boolean not null default true,
  permissao_estoque boolean not null default true,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create table public.configuracoes_acesso (
  id boolean primary key default true check (id),
  acesso_irrestrito_global boolean not null default true,
  permite_consulta_financeira boolean not null default true,
  permite_consulta_estoque_geral boolean not null default true,
  atualizado_em timestamptz not null default now()
);
insert into public.configuracoes_acesso (id) values (true) on conflict (id) do nothing;

create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  nome_pt varchar(120) not null,
  nome_es varchar(120),
  slug varchar(140) not null unique,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create table public.fornecedores (
  id uuid primary key default gen_random_uuid(),
  razao_social varchar(180) not null,
  nome_fantasia varchar(180),
  telefone_whatsapp varchar(25) unique,
  documento_fiscal varchar(30),
  pais char(2) not null default 'BR' check (pais in ('BR', 'PY')),
  moeda_padrao char(3) not null default 'BRL' check (moeda_padrao in ('BRL', 'PYG', 'USD')),
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create table public.produtos (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid references public.categorias(id),
  fornecedor_padrao_id uuid references public.fornecedores(id),
  codigo_sku varchar(50) not null unique,
  nome_pt varchar(150) not null,
  nome_es varchar(150),
  sinonimos_apelidos text not null default '',
  unidade_medida public.unidade_codigo not null,
  preco_custo numeric(14,3) not null default 0 check (preco_custo >= 0),
  preco_venda numeric(14,3) not null default 0 check (preco_venda >= 0),
  estoque_minimo_seguranca numeric(14,3) not null default 0 check (estoque_minimo_seguranca >= 0),
  ncm varchar(10),
  cfop_padrao varchar(10),
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table public.saldos_estoque (
  unidade_id uuid not null references public.unidades(id),
  produto_id uuid not null references public.produtos(id),
  quantidade numeric(14,3) not null default 0 check (quantidade >= 0),
  atualizado_em timestamptz not null default now(),
  primary key (unidade_id, produto_id)
);

create table public.eventos_whatsapp (
  id uuid primary key default gen_random_uuid(),
  chave_externa varchar(180) not null unique,
  telefone_remetente varchar(25) not null,
  tipo_evento varchar(40) not null,
  payload jsonb not null default '{}'::jsonb,
  recebido_em timestamptz not null default now()
);

create table public.movimentacoes_estoque (
  id uuid primary key default gen_random_uuid(),
  unidade_id uuid not null references public.unidades(id),
  produto_id uuid not null references public.produtos(id),
  usuario_id uuid not null references public.usuarios(id),
  evento_whatsapp_id uuid references public.eventos_whatsapp(id),
  idempotencia_chave varchar(180) not null unique,
  tipo_movimentacao public.tipo_movimentacao not null,
  quantidade numeric(14,3) not null check (quantidade > 0),
  delta_estoque numeric(14,3) not null,
  valor_unitario numeric(14,3) not null default 0 check (valor_unitario >= 0),
  origem_canal public.origem_canal not null,
  observacao text,
  criado_em timestamptz not null default now(),
  check ((tipo_movimentacao in ('ENTRADA') and delta_estoque > 0)
      or (tipo_movimentacao in ('SAIDA_CONSUMO', 'PERDA_AVARIA') and delta_estoque < 0)
      or (tipo_movimentacao = 'AJUSTE_INVENTARIO' and delta_estoque <> 0)),
  check (abs(delta_estoque) = quantidade or tipo_movimentacao = 'AJUSTE_INVENTARIO')
);

create table public.sessoes_whatsapp (
  id uuid primary key default gen_random_uuid(),
  telefone_remetente varchar(25) not null unique,
  usuario_id uuid references public.usuarios(id),
  unidade_id uuid references public.unidades(id),
  estado_conversa varchar(60) not null default 'INICIO',
  dados_temporarios_payload jsonb not null default '{}'::jsonb,
  ultima_interacao timestamptz not null default now(),
  expira_em timestamptz
);

create index produtos_ativo_idx on public.produtos (ativo);
create index produtos_sinonimos_trgm_idx on public.produtos using gin (sinonimos_apelidos gin_trgm_ops);
create index movimentacoes_produto_data_idx on public.movimentacoes_estoque (produto_id, criado_em desc);
create index movimentacoes_unidade_data_idx on public.movimentacoes_estoque (unidade_id, criado_em desc);
create index sessoes_expiracao_idx on public.sessoes_whatsapp (expira_em);
create index eventos_telefone_idx on public.eventos_whatsapp (telefone_remetente, recebido_em desc);

create or replace function public.aplicar_movimentacao_estoque(
  p_unidade_id uuid, p_produto_id uuid, p_usuario_id uuid,
  p_idempotencia_chave varchar, p_tipo public.tipo_movimentacao,
  p_quantidade numeric, p_valor_unitario numeric,
  p_origem public.origem_canal, p_observacao text default null,
  p_evento_whatsapp_id uuid default null, p_delta_ajuste numeric default null
) returns table (movimentacao_id uuid, saldo numeric)
language plpgsql security definer set search_path = public
as $$
declare
  v_id uuid;
  v_delta numeric;
  v_saldo numeric;
  v_existente record;
begin
  if p_quantidade <= 0 or p_valor_unitario < 0 then
    raise exception 'quantidade e valor devem ser não negativos (quantidade > 0)';
  end if;
  v_delta := case when p_tipo = 'ENTRADA' then p_quantidade
                 when p_tipo in ('SAIDA_CONSUMO', 'PERDA_AVARIA') then -p_quantidade
                 else coalesce(p_delta_ajuste, p_quantidade) end;
  if p_tipo = 'AJUSTE_INVENTARIO' and (v_delta = 0 or nullif(btrim(coalesce(p_observacao, '')), '') is null) then
    raise exception 'ajuste de inventário exige delta diferente de zero e motivo';
  end if;
  select m.*, s.quantidade as saldo_atual into v_existente
    from public.movimentacoes_estoque m
    left join public.saldos_estoque s on s.unidade_id = m.unidade_id and s.produto_id = m.produto_id
    where m.idempotencia_chave = p_idempotencia_chave;
  if found then
    if v_existente.unidade_id is distinct from p_unidade_id
       or v_existente.produto_id is distinct from p_produto_id
       or v_existente.usuario_id is distinct from p_usuario_id
       or v_existente.tipo_movimentacao is distinct from p_tipo
       or v_existente.quantidade is distinct from p_quantidade
       or v_existente.valor_unitario is distinct from p_valor_unitario
       or v_existente.origem_canal is distinct from p_origem
       or v_existente.observacao is distinct from p_observacao
       or v_existente.evento_whatsapp_id is distinct from p_evento_whatsapp_id
       or v_existente.delta_estoque is distinct from v_delta then
      raise exception 'chave de idempotência já usada por outro payload';
    end if;
    return query select v_existente.id, v_existente.saldo_atual;
    return;
  end if;
  if not exists (select 1 from public.produtos where id = p_produto_id and ativo) then
    raise exception 'produto inválido ou inativo';
  end if;
  if not exists (select 1 from public.unidades where id = p_unidade_id and ativo) then
    raise exception 'unidade inválida ou inativa';
  end if;
  if not exists (select 1 from public.usuarios where id = p_usuario_id and ativo) then
    raise exception 'usuário inválido ou inativo';
  end if;
  if not exists (select 1 from public.usuarios where id = p_usuario_id and ativo and permissao_estoque) then
    raise exception 'usuário sem permissão de estoque ou inativo';
  end if;
  insert into public.saldos_estoque (unidade_id, produto_id, quantidade)
    values (p_unidade_id, p_produto_id, 0)
    on conflict (unidade_id, produto_id) do nothing;
  insert into public.movimentacoes_estoque
    (unidade_id, produto_id, usuario_id, evento_whatsapp_id, idempotencia_chave,
     tipo_movimentacao, quantidade, delta_estoque, valor_unitario, origem_canal, observacao)
    values (p_unidade_id, p_produto_id, p_usuario_id, p_evento_whatsapp_id, p_idempotencia_chave,
      p_tipo, p_quantidade, v_delta, p_valor_unitario, p_origem, p_observacao)
    on conflict (idempotencia_chave) do nothing
    returning id into v_id;
  if v_id is null then
    raise exception 'conflito de idempotência';
  end if;
  update public.saldos_estoque
    set quantidade = quantidade + v_delta, atualizado_em = now()
    where unidade_id = p_unidade_id and produto_id = p_produto_id
      and quantidade + v_delta >= 0;
  if not found then
    raise exception 'saldo insuficiente para baixa/perda';
  end if;
  select quantidade into v_saldo from public.saldos_estoque
    where unidade_id = p_unidade_id and produto_id = p_produto_id;
  return query select v_id, v_saldo;
end;
$$;

create or replace function public.consultar_saldo_estoque(p_unidade_id uuid, p_produto_id uuid)
returns numeric language sql security definer set search_path = public
as $$ select quantidade from public.saldos_estoque where unidade_id = p_unidade_id and produto_id = p_produto_id $$;

create or replace function public.bloquear_alteracao_ledger()
returns trigger language plpgsql set search_path = public
as $$ begin raise exception 'ledger de estoque é imutável'; end; $$;
create trigger movimentacoes_ledger_immutavel
  before update or delete on public.movimentacoes_estoque
  for each row execute function public.bloquear_alteracao_ledger();

do $$ declare t text; begin
  foreach t in array array['unidades','usuarios','configuracoes_acesso','categorias','fornecedores','produtos','saldos_estoque','eventos_whatsapp','movimentacoes_estoque','sessoes_whatsapp'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;
revoke all on all tables in schema public from anon, authenticated;
revoke all on function public.aplicar_movimentacao_estoque(uuid,uuid,uuid,varchar,public.tipo_movimentacao,numeric,numeric,public.origem_canal,text,uuid,numeric) from public, anon, authenticated;
revoke all on function public.consultar_saldo_estoque(uuid,uuid) from public, anon, authenticated;
grant execute on function public.aplicar_movimentacao_estoque(uuid,uuid,uuid,varchar,public.tipo_movimentacao,numeric,numeric,public.origem_canal,text,uuid,numeric) to service_role;
grant execute on function public.consultar_saldo_estoque(uuid,uuid) to service_role;
