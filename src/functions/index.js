// src/index.js
const { app } = require("@azure/functions");
const { handleOrderSlackApi, handleAICommand } = require("./orderHandlers.js");
const { handleSlackInteractions } = require("./interactionHandlers.js");
const { setupDelayMonitoring } = require("./handledelay");
const { setupReporting } = require("./reportService");
const {
	checkPendingOrderDelays,
	checkPaymentDelays,
	checkProformaDelays,
} = require("./handledelay");
const { generateReport, analyzeTrends } = require("./reportService");
const { Order } = require("./db");
const { notifyUserAI } = require("./notificationService");
const { createSlackResponse } = require("./utils");
const { OpenAI } = require("openai");
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});
require("dotenv").config(); // Load environment variables from .env file

app.http("orderSlackApi", {
	methods: ["POST"],
	authLevel: "anonymous",
	handler: async (request, context) => {
		try {
										console.log("** STAGING");
			// setupDelayMonitoring();
			// setupReporting(context);
			console.log("⚡ Order Management System is running!");
			console.log(`
📋 Available commands:
  /order help                    - Show help
  /order config                  - Open configuration panel (admin only)
  /order list                    - List all configurations (admin only)
  /order add [type] [value]      - Add configuration option (admin only)
  /order remove [type] [value]   - Remove configuration option (admin only)
  /order addrole @user [role]    - Add role to user (admin only)
  /order removerole @user [role] - Remove role from user (admin only)
  /order new                     - Create new order
    `);

			console.log("Delay monitoring scheduled to run every hour.");

			return await handleOrderSlackApi(request, context);
		} catch (error) {
			context.log(`❌ Erreur interne : ${error}`);
			return { status: 500, body: "Erreur interne du serveur" };
		}
	},
});

app.http("slackInteractions", {
	methods: ["POST"],
	authLevel: "anonymous",
	handler: async (request, context) => {
		try {
			console.log("** slackInteractions");
			return await handleSlackInteractions(request, context);
		} catch (error) {
			context.log(`❌ Erreur interne : ${error}`);
			return { status: 500, body: "Erreur interne du serveur" };
		}
	},
});


