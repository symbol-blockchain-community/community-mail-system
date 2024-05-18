declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_SES_SMTP_USER: string;
      AWS_SES_SMTP_PASSWORD: string;
      AWS_SES_SMTP_ENDPOINT: string;
      COSMOS_ENDPOINT: string;
      COSMOS_KEY: string;
      COSMOS_DATABASE: string;
      COSMOS_CONTAINER: string;
      AZURE_AD_GROUP_ID: string;
    }
  }
}

import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user?: {
      email: string;
      name: string;
      image?: string;
    } & DefaultSession["user"];
  }
}

// If this file is a module (you have any imports/exports), you need to export something to make it a module:
export {};
