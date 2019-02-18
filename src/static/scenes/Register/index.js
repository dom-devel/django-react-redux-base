import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import classNames from "classnames";
import { push } from "connected-react-router";
import t from "tcomb-form";
import PropTypes from "prop-types";

const Form = t.form.Form;

const Login = t.struct({
	email: t.String,
	password: t.String
});

