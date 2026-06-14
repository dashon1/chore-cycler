import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Members from "./Members";

import Chores from "./Chores";

import Rewards from "./Rewards";

import RewardHistory from "./RewardHistory";

import Assignments from "./Assignments";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Login from './Login';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Members: Members,
    
    Chores: Chores,
    
    Rewards: Rewards,
    
    RewardHistory: RewardHistory,
    
    Assignments: Assignments,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    if (/\/login$/i.test(location.pathname)) {
        return <Routes><Route path="/login" element={<Login />} /><Route path="/Login" element={<Login />} /></Routes>;
    }

    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Members" element={<Members />} />
                
                <Route path="/Chores" element={<Chores />} />
                
                <Route path="/Rewards" element={<Rewards />} />
                
                <Route path="/RewardHistory" element={<RewardHistory />} />
                
                <Route path="/Assignments" element={<Assignments />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}