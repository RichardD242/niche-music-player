# Niche music player

a niche music player that turns youtube links into cool vinyl music disks

## features

- yt link extractor
- the spinning disc
- fullscreen mode
- darkmode lightmode and other settings

## tech stack

- react 19 + typescript
- vite 8
- tailwind css
- lucide icons

everything runs through client side (for storage it uses localstorage)

## how it works / how to use it

### adding a track

you paste a youtube link into the play section and click the plus button

### cover of music disk

there is no api call for metadata. the cover that is on the disk is the youtube thumbnail. my tip: when searching your music on youtube just add **album cover** at the end so you get the cleanest cover on the disk. 

### premade playlist

i will maybe add full playlist later but there are alredy some songs that you can listen to (janice stfu and cant tell me nothing)

### playback

playback happens through a hidden youtube iframe embed, not official youtube api (so far)

### storage

tracks and settings are stored in the browsers localstorage so everything local