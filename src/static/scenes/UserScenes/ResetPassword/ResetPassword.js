// Create form
const Form = t.form.Form;
t.form.Form.templates = templates;

const PasswordReset = t.struct({
	email: t.String
});
