# HistoryMapper

## Overview

This is an application for exploring historical maps and learning more about events that happened in the past. You can navigate through historical periods, seeing how the maps change in time. What is more, the events displayed on the maps have suggesting descriptions, and other useful information for better understaning History and clearly positioning the information in time. You can make an account for having access to the quizzes that test the information you have learnt, all arganized on a specific historical topic.


## Technologies

The HistoryMapper application has a backend created in Python with Django framework and Oracle SQL Database. The frontend is written in HTML, CSS, and Javascript with Angular framework. As external APIs, there were used the Google Maps Javascript API, DBPedia API, and YouTube API.

## Backend

- Django REST API framework for API creation
- Access to the DB via Django ORM
- User model from Django made accessible with the usage of a Serializer
- Clustering algorithm for events using KMeans model
- External APIs called: Google Maps Javascript API, Geocoding API, DBPedia API, Youtube API
- Data validation

## Frontend

- Routing model
- Header and footer
- Communication via components
- API calls only in services
- Private routes: for quizzes and quiz questions, profile, admin page
- Page with forms (and form validatiors): log-in/ register/ explore-maps/ admin page/ profile page

## Database 
![image](https://github.com/user-attachments/assets/8e36d9ec-20fb-48d8-8264-d6fdfeba7dc1)



## Bibliography
#### For implementation
##### Backend
Tutorial: [Writing your first Django app, part 2 | Django documentation | Django (djangoproject.com)](https://docs.djangoproject.com/en/4.2/intro/tutorial02/)
Git: [did_django_google_maps_api/main/templates/main/base.html at main · bobby-didcoding/did_django_google_maps_api (github.com)
](https://github.com/bobby-didcoding/did_django_google_maps_api/blob/main/main/templates/main/base.html)https://github.com/bobby-didcoding/did_django_google_maps_api/blob/main/main/templates/main/base.html
AUthentication system: https://www.bing.com/videos/riverview/relatedvideo?&q=django+rest_framework+authentication+angular&&mid=52C326912E43AC9C217152C326912E43AC9C2171&&FORM=VRDGAR

##### Frontend
Logo creation: https://looka.com/logo-maker/
Display of a Google map in Angular: https://www.bing.com/videos/riverview/relatedvideo?&q=display+google+maps+with+angular+9+&&mid=6DE7E831C0AFD20A0CC06DE7E831C0AFD20A0CC0&&FORM=VRDGAR
https://developers.google.com/maps/documentation/javascript
Markers on map: https://stackoverflow.com/questions/46937595/set-multiple-markers-with-angular-4-and-google-maps


#### For historical information
- https://www.history.com/news/prehistoric-ages-timeline
- https://www.yourdictionary.com/articles/historical-eras-list
- https://www.history.com/topics/middle-ages/middle-ages
- https://www.onthisday.com/countries/united-kingdom/england#:~:text=Events%20in%20English%20History%201%20Hadrian%27s%20Wall%200122-09-13,Tinchebrai%20...%208%20Royal%20Coronation%20...%20More%20items
- https://www.history.org.uk/primary/resource/3867/the-vikings-in-britain-a-brief-history
