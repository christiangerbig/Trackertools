# Trackertools

## Description

This collection includes four tools for the music editor ProTracker, which make the work with standard ProTracker sound modules more comfortable:
 - TonePortaStep (calculate tone portamento slide)
 - VolSlideStep (calculate volume slide up or down)
 - SearchFxCmd (find effect commands with their outputted position in a tracker module)
 - UsedFxCmd (overview which effect commands are used in a module)
 
## User Stories

- 404
   - 404 page when user goes to a page that doesn’t exist 
- Homepage
   - What the app is about. 
- Header
   - Links to access all tools and Link to Homepage
- Footer
   - Links to my GitHub and LinkedIn
- TonePortaStep
   - Input fields for the calculation and links to About and Help
- VolSlideStep 
   - Input fields for the calculation and links to About and Help
- SearchFxCmd 
   - Input fields for the serch amd and links to About and Help
- UsedFxCmd 
   - Links to About
- Contact 
   - Form to send a message

## ROUTES:

- GET / 
  - renders homepage

- GET /toneportastep
   - renders tonePortaStep page

- GET /volslidestep
   - renders volSlideStep page

- GET /searchfxcmd
   - renders searchFxCmd page

- GET /usedfxcmd
   - renders usedFxCmd page

- GET /contact
  - renders contact page
  - option to send message

- POST /contact
  - redirects to homepage
  - create request

## Models

Models: Request-Model

```javascript
{
  email: String,
  message: String,
}
```

## Links

### Git

[Repository Link](https://github.com/christiangerbig/Trackertools)

### Heroku

[Deploy Link](https://trackertools.herokuapp.com/)

### Tech page

[ProTracker module format Link](https://wiki.multimedia.cx/index.php/Protracker_Module)