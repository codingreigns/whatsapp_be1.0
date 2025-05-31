import logger from "../config/logger.config.js";

export default function killerFunction(server) {
  const exitHandler = () => {
    if (server) {
      logger.info("Server closed");
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);

  //SIGTERM
  process.on("SIGTERM", () => {
    if (server) {
      logger.info("SIGTERM received shutting down gracefully");
      process.exit(1);
    }
  });
}
