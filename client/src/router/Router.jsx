import React, { Fragment, useContext } from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import Hero from '../pages/Hero'
import Home from '../pages/Home'
import Write from '../pages/Write'
import Docs from '../pages/Docs'
import Profile from '../pages/Profile'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import appContext from '../context/appContext'
import Article from '../pages/Article'

const Router = () => {
    const { State } = useContext(appContext);
    const { WalletAddress } = State;

    return (
        <Fragment>
            <BrowserRouter>
                <Routes>
                    <Route path='/' index element={<Hero />} />
                    <Route
                        path='/*'
                        element={
                            <Fragment>
                                <Navbar />
                                <Outlet />
                                <Footer />
                            </Fragment>
                        }
                    >
                        <Route path='read' element={<Home />} />
                        <Route path='read/:id' element={<Article />} />
                        <Route path='write' element={WalletAddress ? <Write /> : <Hero />} />
                        <Route path='docs' element={<Docs />} />
                        <Route path='profile' element={WalletAddress ? <Profile /> : <Hero />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Fragment>
    )
}

export default Router
