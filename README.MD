# SocialConnect - A Meteor.js Social Web App

A minimalistic social web app built with Meteor.js, React, and Tailwind CSS.

## Features

- User account management (login, signup, profile)
- Post creation and feed display
- Like posts
- Simple UI with Tailwind CSS

## Setup & Installation

1. Clone the repository
2. Install dependencies:

```
meteor npm install
```

3. Run the application:

```
meteor
```

## Commands Used

```
# User Authentication
meteor add accounts-password accounts-base react-meteor-data

# UI Framework
meteor npm install react-router-dom

# Additional packages
meteor add jquery
meteor npm install tailwindcss postcss autoprefixer

meteor add email
```

# To run the app with settings
#run the app
meteor run --settings ../settings.json

## Project Structure

```
my-app/
  client/             # Client-side code
  imports/            # Modular code used on client and server
    api/              # API collections and methods
      messages/       # Chat messaging functionality
      posts/          # Posts functionality
      users/          # User profile functionality
    ui/               # React components
      components/     # Reusable UI components
      pages/          # Page components
  server/             # Server-side code
```

## Next Development Steps

- Implement chat functionality
- Add profile page
- Add explore page for discovering users
- Implement comments on posts
- Add image uploads
