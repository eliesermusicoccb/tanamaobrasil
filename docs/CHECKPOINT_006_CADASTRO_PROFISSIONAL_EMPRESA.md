# CHECKPOINT 006 — Cadastro aceitando profissional ou empresa

## Objetivo

Ajustar a linguagem do cadastro para deixar claro que o TáNaMão Brasil aceita tanto profissionais autônomos quanto empresas prestadoras de serviço.

## O que foi alterado

1. No cadastro profissional, o campo **Nome completo** foi alterado para **Nome do profissional ou empresa**.
2. O exemplo do campo foi alterado para **Ex.: João Eletricista ou Elétrica Silva**.
3. A mensagem de erro foi ajustada para **Informe o nome do profissional ou da empresa**.
4. Na revisão do cadastro, o campo agora aparece como **Nome do perfil**.
5. A área de foto foi ajustada de **Foto de Perfil** para **Foto ou logo do perfil**, ajudando empresas a entenderem que podem usar logotipo.
6. Na edição de perfil, o campo **Nome** foi ajustado para **Nome do profissional ou empresa**.

## Por que isso é importante

A plataforma não deve parecer limitada apenas a pessoas físicas. Muitos negócios locais prestam serviço e podem virar bons anunciantes dentro do TáNaMão Brasil, como assistências técnicas, empresas de limpeza, oficinas, clínicas de beleza, manutenção residencial, pequenas construtoras e equipes especializadas.

## Arquivos alterados

- `src/RegisterProfessional.jsx`
- `src/App.jsx`
- `docs/CHECKPOINT_006_CADASTRO_PROFISSIONAL_EMPRESA.md`

## Próximo cuidado estratégico

Em uma etapa futura, pode ser interessante criar um campo separado chamado **Tipo de cadastro**, com opções:

- Profissional autônomo
- Empresa

Por enquanto, esta correção resolve a comunicação sem exigir mudança no banco de dados.
