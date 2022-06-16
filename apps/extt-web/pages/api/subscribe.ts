import { NextApiHandler } from "next";
import { notion } from "../../lib/notion";

export const subscribe: NextApiHandler = async ({ body, method }, res) => {
  if (method !== "POST") {
    return res.status(409).send("not allowed");
  }

  if (!body.email) {
    return res.status(400).send("bad request");
  }

  const record = await notion.pages.create({
    parent: { database_id: process.env.NOTION_DATABASE_ID as string },
    properties: {
      email: {
        email: body.email,
        type: "email",
      },

      createdAt: {
        date: {
          start: new Date().toISOString(),
        },
        type: "date",
      },
    },
  });

  return res.status(200).json({
    result: "success",
  });
};

export default subscribe;
