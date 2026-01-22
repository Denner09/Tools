# Roadmap de Desenvolvimento (Dev)

Este documento descreve o plano de evolução técnica e funcional do projeto Business Tools.

## 📅 Roadmap

### ✅ Fase 1: Fundação (Atual)

- [x] Estrutura Core (Vue.js, PWA, Bootstrap).
- [x] Ferramentas de Texto (Conversão, CNJ, Stats).
- [x] Suíte PDF Completa (WASM, OCR, Manipulação).
- [x] Modelador BPMN 2.0.
- [x] UI/UX Premium (Dark Mode, Responsivo, Animações).

### 🚧 Fase 2: Identidade e Dados (Próximos Passos)

Esta é a fase prioritária atual.

- [ ] **Página de Login**: Implementação de interface de autenticação.
- [ ] **Integração com Banco de Dados**:
  - Persistência de preferências de usuário.
  - Salvamento de documentos/diagramas na nuvem.
  - Histórico de atividades.

### 🔮 Fase 3: Corporativo (Futuro)

- [ ] **Integração SSO (Single Sign-On)**:
  - Suporte a OAuth2 / OpenID Connect.
  - Integração com Google Workspace / Microsoft Azure AD.
- [ ] Colaboração em tempo real (WebSockets) para o Modelador BPMN.
- [ ] API Backend dedicada para processamento pesado (opcional, híbrido local/nuvem).

---

## Notas de Desenvolvimento

- Manter foco na performance client-side sempre que possível para reduzir custos de infraestrutura.
- A segurança (CSP e higienização de inputs) deve ser mantida com prioridade máxima ao integrar o Banco de Dados.
