# Next.js Project

This is a test assignment built using [Next.js](https://nextjs.org/).

## Demo

Check out the live demo of the project (deployed on Railway) [HERE](https://dzencode-tt-production.up.railway.app/).

## 🛠 Tech Stack

- Next.js
- Redux, Redux Toolkit
- TypeScript
- SCSS Modules
- MySql
- react-hook-form, Zod
- WebSocket
- Next-intl
- Cloudinary

## 🚀 How to Run the Project Locally

Follow these steps to download, install, and run the project on your machine:

```bash
# 1. Clone the GitHub repository to your local machine
git clone https://github.com/ArtemPaskall/dzencode-tt

# 2. Navigate into the project directory
cd YOUR-REPOSITORY-NAME

# 3. Install all required dependencies from package.json
npm install

# 4. Place the .env.local file in the root of the project (it is attached in the Telegram working chat)

# 5. Start the development server
npm run dev
```

## Project Description

This project is a Next.js application built using the libraries listed above.

The header contains:

a counter of active WebSocket connections

current date and time

a language switcher

On the side, there is a menu with the main sections: Products and Orders.

### Products

The Products section displays a list of products with all related information, along with a delete button for each item.

It is possible to add new products using a form validated with react-hook-form and Zod.
There is also an option to upload an image, which is stored in the cloud.

### Orders

The Orders section displays a list of orders and allows creating new ones.
Each order can include products selected from the product list.

Each order contains:

full order details

a delete button (which opens a confirmation modal before deletion)

When clicking on an order, a panel opens on the right side showing the list of products included in that order, with the ability to add and remove products.

Any changes to the product list are reflected and automatically updated across the orders.

### Deployment and Database

The project is deployed on Railway using Docker, and the MySQL database is hosted there as well. The local project connects to the database using external connection settings. Inside Railway, services communicate with the database via an internal port.

### Database schema in a file:

mydbSchema.mwb

### Video Overview

1 - [Products](https://www.loom.com/share/9e26112c98c14e099bc0c0be6e0bbedc)
1 - [Orders](https://www.loom.com/share/baf4d9c53c1c44c8a14486a9d64ceaf6)
1 - [Project Overview](https://www.loom.com/share/52e00bc1dd904cac991d414b2b1594d2)