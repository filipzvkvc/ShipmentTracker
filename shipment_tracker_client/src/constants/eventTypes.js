const EVENT_TYPES = {
  TOKEN_EVENTS: {
      TOKEN_CHANGED : "token_changed"
  },
  PROFILE_EVENTS : {
    RESET_UI_INPUT_VALUES : "reset_ui_input_values",
    REFETCH_USER_ACCOUNT : "refetch_user_account"        
  },
}

export default EVENT_TYPES;
export const { TOKEN_EVENTS, PROFILE_EVENTS} = EVENT_TYPES;