# Health Assessments, phase 2

Prototype for the B2B2C corporate health assessment sign up and profile setup.

Scaffolded from `activationUI`, which already carries the DCA global UI this
design reuses: the header, the LHS carousel panel, the field and select
components, the Need help card. Figma is the reference, file
`rDltwIr2dJvUUNaXEqEYFO`, section `5066:125326` "Sign up or in - Web".

Scope, per Janelle 2 Sep: account creation and the global UI, happy path only,
no error screens. There is no invitation code step here. The code arrives by
email and is used later, for the questionnaire.

    npm install
    npm run dev
    npm run check     # typecheck + tests
