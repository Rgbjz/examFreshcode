import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import Router from './router';
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import Payment from './pages/Payment/Payment';
import StartContestPage from './pages/StartContestPage/StartContestPage';
import Dashboard from './pages/Dashboard/Dashboard';
import NotFound from './components/NotFound/NotFound';
import Home from './pages/Home/Home';
import ContestPage from './pages/ContestPage/ContestPage';
import UserProfile from './pages/UserProfile/UserProfile';
import 'react-toastify/dist/ReactToastify.css';
import ContestCreationPage from './pages/ContestCreation/ContestCreationPage';
import CONSTANTS from './constants';
import browserHistory from './browserHistory';
import ChatContainer from './components/Chat/ChatComponents/ChatContainer/ChatContainer';
import Layout from './pages/Layout/Layout';
import OnlyNotAuthorizedUserRoute from './components/Routes/OnlyNotAuthorizedUserRoute/OnlyNotAuthorizedUserRoute';
import PrivateRoute from './components/Routes/PrivateRoute/PrivateRoute';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import EventPage from './pages/EventPage/EventPage';
import WithModeratorRoute from './components/Routes/WithModeratorRoute/WithModeratorRoute';
import ModeratorPage from './pages/ModeratorPage/ModeratorPage';
import CustomerRoute from './components/Routes/CustomerRoute/CustomerRoute';
import useEventWatcher from './components/Hooks/useEventWatcher';

export default function App () {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('events');
        if (saved) setEvents(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('events', JSON.stringify(events));
    }, [events]);

    const updateEvent = updated => {
        setEvents(prev => prev.map(e => (e.id === updated.id ? updated : e)));
    };

    useEventWatcher(events, updateEvent);

    return (
        <Router history={browserHistory}>
            <ToastContainer
                position='top-center'
                autoClose={5000}
                hideProgressBar
            />

            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Home />} />

                    <Route element={<OnlyNotAuthorizedUserRoute />}>
                        <Route path='/login' element={<LoginPage />} />
                        <Route
                            path='/registration'
                            element={<RegistrationPage />}
                        />
                    </Route>

                    <Route path='/howItWorks' element={<HowItWorks />} />

                    <Route element={<PrivateRoute />}>
                        <Route path='/payment' element={<Payment />} />
                        <Route
                            path='/startContest'
                            element={<StartContestPage />}
                        />

                        <Route
                            path='/startContest/nameContest'
                            element={
                                <ContestCreationPage
                                    contestType={CONSTANTS.NAME_CONTEST}
                                    title='Company Name'
                                />
                            }
                        />

                        <Route
                            path='/startContest/taglineContest'
                            element={
                                <ContestCreationPage
                                    contestType={CONSTANTS.TAGLINE_CONTEST}
                                    title='TAGLINE'
                                />
                            }
                        />

                        <Route
                            path='/startContest/logoContest'
                            element={
                                <ContestCreationPage
                                    contestType={CONSTANTS.LOGO_CONTEST}
                                    title='LOGO'
                                />
                            }
                        />

                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path='/contest/:id' element={<ContestPage />} />
                        <Route path='/account' element={<UserProfile />} />

                        <Route element={<CustomerRoute />}>
                            <Route
                                path='/myEvents'
                                element={
                                    <EventPage
                                        events={events}
                                        setEvents={setEvents}
                                    />
                                }
                            />
                        </Route>
                    </Route>

                    <Route element={<WithModeratorRoute />}>
                        <Route path='/moderator' element={<ModeratorPage />} />
                    </Route>

                    <Route path='*' element={<NotFound />} />
                </Route>
            </Routes>

            <ChatContainer />
        </Router>
    );
}
