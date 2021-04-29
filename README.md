# Project Name
Trackertools

## Description

A collection of tools for a work with the Amiga Protracker
 
## User Stories

**404**
 - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
**500**
 - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
**homepage**
 - As a user I want to be able to access the homepage so that I see what the app is about. 
**Header**
 - Links to access all tools and  Link to Homepage.
**TonePortaStep**
 - Input fields for the calculation Links to About and Help
**VolSlideStep** 
 - Input fields for the calculation Links to About and Help
**SearchFxCmd** 
 - Input fields for the calculation Links to About and Help
**UsedFxCmd** 
 - Input fields for the calculation Links to About
**Contact** 
 - Form to send a message

## ROUTES:

- GET / 
  - renders the homepage

- GET /toneportastep
   - renders to toneportastep

- GET /volslidestep
   - renders to volslidestep

- GET /searchfxcmd
   - renders to searchfxcmd

- GET /usedfxcmd
   - renders to usedfxcmd

- GET /contact
  - renders contact
  - option to send message

- POST /contact
  - redirects to homepage
  - create request

## Models

Models: Request-Model

## Links

### Git
The url to your repository and to your deployed project
[Repository Link](https://github.com/christiangerbig/Trackertools)

### Heroku
[Deploy Link](https://trackertools.herokuapp.com/)

### Slides

The url to your presentation slides
[Slides Link]()