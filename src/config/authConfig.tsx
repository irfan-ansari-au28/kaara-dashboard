import { Configuration, PopupRequest } from "@azure/msal-browser";

export const msalConfig: Configuration = {
    auth: {
        clientId: import.meta.env.VITE_CLIENT_ID ?? '', // Replace with your Azure AD app client ID
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_APP_TENANT_ID}`, // Replace with your tenant ID
        redirectUri: `${window.location.origin}`, // Replace with your redirect URI
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

export const loginRequest: PopupRequest = {
    scopes: ["User.Read"],
};