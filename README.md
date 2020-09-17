# Hearthstone Pack Simulator
 This project has been expanded from an exam I did in Web Development and API-Design. The original exam can be found on my Github page, under the name PG6301_340.
 I've later added a few functionalities to make the app more whole, with a better UX and added images. There's a bunch of cleanup on the backend to make it run more clean
 and keep everything neat. I've also stored data in JSON-files so that everything is persistent.
 
 ### Run Guide
 

To run the application you need to do the following

* Run "yarn install" in your commandline at the project.
* After the installation you can host a local server by running "yarn start" (Will run at port 8080, ensure it's available)
* Connect to the local server by going to localhost:8080 on your browser

When you load into the page you can register a new account, or if you ever wanted to know what it felt like to be super-rich
in terms of virtual collectible cards, you can login with the usernam "richie_rich" and password "cashmoney".

### API
The API is divided into three repositories, user, collection and packs, all with a range of endpoints covering GET, PUT,
POST and DELETE. The API is logically divided, and follows best practice URI-naming schemes, I have also enforced lowercase
letterings for usernames so that their names can be used directly as ids in the URI. The RESTful api is based on best
practices and RFC standards, they are meaningful (though not all are rendered in the frontend) and should be self-evident
as to what handles what. The cards available from the API are all real JSON representation of collectible cards in the game Hearthstone,
partially downloaded on a local JSON-file in the cards database folder. The APIs are built using express, which can easily make
CRUD-APIs by itself, and was the only dependency for this I found necessary for a project of this size.

### Authentication and Authorization
Authentication is done through passport which saves user's id in asession cookie, when I do authentication or
authorization checks, I check this session cookie. On open endpoints, in this exam's case the /api/cards endpoint,
we don't do any authentication or authorization. If the user is not explicitly targeting in the endpoint (which they may do
in a GET request, for instance), we only authenticate and use the id from the session cookie. If the user is making a 
request to a specific id, we do an authorization by checking that his session cookie matches the ID he requested.

In the exam task it was explicitly mentioned we should use 401 for authentication and 403 for authorization, so I have
followed this convention. It's my understanding of the recent [RFC standards](https://tools.ietf.org/html/rfc7235#section-4.1)
that this should be the other way around, as 401 is semantically called Unauthorized rather than Unauthenticated. Because of this
this repository still follows the old standards from the exam, but I might change this in teh future.

### Frontend
The frontend is built in React and uses React Router to enable it as a Single-Page Application. It matches all the parameters of the
exam, and has a few additions for the user as mentioned over, such as buying cards and cards having rarity. The frontend uses best
practice conventions and is structured optimally to maintain seperation of concerns when needed. Because the UI is very simple, most
components handle all their own rendering, with the exception of the Home page with the description, which uses the CardList file to
render all the cards in their proper class. As styling is not a requirement for this exam, the styling is based on skeleton.css, 
which is present in the project, so as to make it look structured and easy to understand. Additional styling has been 
added to format the page and cards, skeleton is just to create the layout. 

### Testing
All the tests are designed to be as thorough as possible, and all 401 and 403 checks are handled by the security-test file. The tests are
made with Jest, supertest and Enzyme. Unfortunately, due to a bug I still have not tracked down, almost all of the application is 
unwilling to play along with the overrideFetch method from the mytest-utils that we got from Andrea, and such almost all fetching from
the frontend was impossible to run from the tests. Due to this, they be cut from the tests. 
The frontend is still being tested where possible, and overall the coverage of the application should be satisfactory, especially
for it's scale.

### WebSockets
Websockets is implemented to give players airdrops with packs for every minute they stay connected to the server, this is done by running
the method on an interval in the websocket server each time a person connects. These airdrops are shown on the UI, and the user can track
how many drops they have gotten since the last time they looked at their packs. The websockets can handle multiple connections from
users, and will shut down when the disconnects the browser or the React application dismounts. I think it fits the paramters of the 
tasks quite well, but it lacks security features. If I had more time, I would have implemented it with verification, as the user can
technically call the endpoint at any time to recieve the airdrops, the UI is just on a fixed timer. In that implementation I would have
genereated a key on the server that would be sent through the the websockets message, which then could be used as a parameter 
on the airdrop API to "unlock" a pack. Wouldn't be too hard of an implementation, but I wanted to focus on the explicit tasks in the
exam.


 ###Future implementations
 - Add the ability to buy packs from different sets
 
 - Animations and interactivity for pack opening
 
 - Show modals of cards when clicking on 