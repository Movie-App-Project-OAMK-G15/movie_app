import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import FavMovies from './components/FavMovies.jsx';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap"
import ErrorPage from './screens/ErrorPage.jsx'
import Authentication from './screens/Authentication.jsx'
import { AuthenticationMode } from './screens/Authentication.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import UserProvider from './context/UserProvider.jsx'
import BrowseMovies from './components/BrowseMovies.jsx'
import Screenings from './components/Screenings.jsx'
import GenreMoviesPage from './components/GenreMoviePage.jsx'
import UserAccount from './screens/UserAccount.jsx'
import Home from './components/Home.jsx'
import Showtime from './components/ShowTime.jsx'
import MoviePage from './components/MoviePage.jsx'
import CreateGroup from './screens/CreateGroup.jsx'
import GroupList from './screens/GroupList.jsx'
import GroupView from './screens/GroupView.jsx'
import GroupAdminPanel from './screens/GroupAdminPanel.jsx'
import AddGroupPosts from './screens/AddGroupPost.jsx'
import UserGroups from './components/UserGroups.jsx';
import BrowsingReviews from './screens/BrowsingReviews.jsx';
import UserOwnGroups from './components/UserOwnGroups.jsx';
import UserChoice from './components/User_Choice.jsx';
import './styles/Global.css';
import MyReviews from './components/MyReviews.jsx'

//creating router for navigation and authentication
const router = createBrowserRouter([
  {
    errorElement: <ErrorPage/>
  },
  {
    path: 'movie/:movieId',  
    element: <MoviePage />
  },
  {
    path: 'showtime/:id',
    element: <Showtime/>
  },
  {
    path: 'screenings',
    element: <Screenings/>
  },
  {
    path: `genre/:genreId`,
    element: <GenreMoviesPage/>
  },
  {
    path: 'search',
    element: <BrowseMovies/>
  },
  {
    path: 'browsereviews',
    element: <BrowsingReviews/>
  },
  {
    path: '',
    element: <Home/>
  },
  {
    path: 'signup',
    element: <Authentication authenticationMode={AuthenticationMode.Register}/>
  },
  {
    path: 'signin',
    element: <Authentication authenticationMode={AuthenticationMode.Login}/>
  },
  {
    path: 'confirm',
    element: <Authentication authenticationMode={AuthenticationMode.Confirm}/>
  },
  {
    path: 'groups',
    element: <GroupList/>
  },
  {
    path: '/account/favmovies/:userId',
    element: <FavMovies />
  },
  {
    path: '/reviews/user/:userEmail',
    element: <MyReviews />
  },
  {
    path: '/userChoice',
    element: <UserChoice />
  },
  {
    element: <ProtectedRoute/>,
    children: [
      {
        path: 'account',
        element: <UserAccount />
      },
      {
        path: 'account/creategroup',
        element: <CreateGroup/>
      },
      {
        path: 'groups/:groupId',
        element: <GroupView/>
      },
      {
        path: 'groups/admin/:groupId',
        element: <GroupAdminPanel/>
      },
      {
        path: 'groups/newpost/:groupId',
        element: <AddGroupPosts/>
      },
      {
        path: 'account/mygroups/:userId',
        element: <UserGroups />
      },
      {
        path: 'account/myowngroups/:userId',
        element: <UserOwnGroups />
      },
     
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router}/>
    </UserProvider>
  </StrictMode>,
)
