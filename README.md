OVERVIEW

This project implements a Discover & Invest workflow for a stock dashboard using Angular 20 and Ionic 8. It closely follows the provided Figma design and incorporates data integration, component reuse, and interactive animations. The focus is on design fidelity, state management, and future maintainability.

The application allows users to:
- Buy stocks via a swipe-to-confirm animation
- Persist user portfolio (stocks) locally
- Search for stocks
- View recently searched stocks (assuming)
- Highlight top 3 stocks by trading volume

Component Breakdown

Tabs:
- Each tab routes to Invest/Discover pages
- Default routes to Invest

DiscoverPage:
- Fetches stock data- Stock search.
- Handles input filtering, clearing, and selection of recently viewed stocks.
(Clicking on a stock returned back in the search result adds its to the recenly view list- Assuming clicking on a stock would open the stock details page or a modal to view details- Not implemented considering the time constarints)
- Displays Top 3 Volume stock cards ( assuming vomune as the determining factor)

InvestPage:
- Displays equity from the holding
- Lists the stocks purchased by the user
- Display Top 10 trending stocks- assuming marketcap is the deciding attribute
- Clicking on cards enabled purchasing the stock

BuyModel:
- Hold the logic for the Buy model.
- User has to enter the shares they want to purchase which automatically updates the price 
- swipe button disabled untill shares entered. 
- On swipe, stock added to the holding list and dispalys a success notification

Shared Component:
StockCardPage:
- Reusable card compoenent for top 3 stocks by volume and trending stocks.

IntstrumentPage:
- Reusable compoenent for recently view and Holdings list

TypePillPage:
- Display stock type (ETF/STOCK)

SVG icon:
- Reusable svg component change styles of the svg image.


Services & Utilities

StockService & StockNormalize
- Fetches Pricing and Details data
- StockNormalize merges data to produce StockDetails consumable by components.
- Returns an observable stream (stockDetails$) for component consumption.

StockStorageService
- Manages local storage for Recently viewed stocks and User portfolio 

Data design
- It relies on two main data sources for stocks: Pricing and Details.
- Mock services fetch data from Json which would be replaced by the api endpoints.
- Data Normalised before being used.
- Recently viewed stocks and user-owned stocks stored in local storage, It is used for offline persistence. This is temporary and planned to be replaced by a backend database in the future.

Future Enhancements
- Integrate live API endpoints with WebSockets for real-time pricing.
- Implement NgRx for centralized state management for larger portfolios.
- Implement a details page. Clicking on the cards or the serach results to redirect to details page
- Error handling for storage failures or corrupted data.
- Backend replacement for persistent user data across devices.
- API error handling: graceful fallback when network fails (e.g., showing cached recently viewed stocks).
- Unit Testing using Jasmine + TestBed.

Steps to run the app

node : v20.19.5
npm : 10.8.2
angular : v20
ionic: 8

- install dependencies
npm intall

- start server
npm start