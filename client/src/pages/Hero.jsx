import React, { Fragment, useContext } from 'react';
import denews_hero from '../assets/denews_hero.svg';
import { motion } from 'framer-motion';
import appContext from '../context/appContext';
import { Link } from 'react-router-dom';

const Hero = () => {
    const { State, getStateParameters } = useContext(appContext);
    const { WalletAddress } = State;

    return (
        <Fragment>
            <section className="dark:bg-gray-100 dark:text-gray-800 min-h-screen">
                <div className="container flex flex-col lg:flex-row justify-evenly p-6 mx-auto sm:py-12 lg:py-24">
                    <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:w-2/5 lg:text-left">
                        <h1 className="text-5xl font-bold sm:text-6xl leading-none">Decentralize Your
                            <span className="dark:text-primary"> Articles</span>
                        </h1>
                        <p className="mt-6 mb-8 text-lg sm:mb-12">Empower yourself with unbiased, decentralized news. Stay informed with transparency and trust.
                            <br className="hidden md:inline lg:hidden" />Join the revolution in news today.
                        </p>
                        <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
                            {
                                WalletAddress ? <Link to={'/read'} className="px-8 py-3 text-lg font-semibold rounded dark:bg-primary dark:text-gray-50 hover:bg-primary/80">Get Started</Link> : <button className="px-8 py-3 text-lg font-semibold rounded dark:bg-primary dark:text-gray-50 cursor-pointer hover:bg-primary/80" onClick={(e) => {
                                    e.preventDefault();
                                    getStateParameters();
                                }}>Connect Wallet</button>
                            }
                            <Link to={'/docs'} className="px-8 py-3 text-lg font-semibold border rounded dark:border-gray-800">Learn More</Link>
                        </div>
                    </div>
                    <motion.div
                        className="flex items-center justify-center lg:mt-0 lg:w-5/12 h-auto"
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <img src={denews_hero} alt="DeNews Hero" className="object-contain w-full h-auto" />
                    </motion.div>
                </div>
            </section>
        </Fragment>
    );
}

export default Hero;


// Ten Practical Ways to Improve Your Focus 

// In today’s fast-paced world, maintaining focus and mental clarity is more challenging than ever. Distractions from technology, multitasking, and stress can cloud the mind. However, you can improve your focus with some practical strategies.

// Start by creating a distraction-free environment. Turn off notifications and designate specific times to check emails. Practicing mindfulness through meditation or deep breathing can help center your thoughts. Physical health also impacts mental clarity—stay hydrated, eat nutrient-rich foods, and get regular exercise.

// Break large tasks into smaller, manageable steps to avoid feeling overwhelmed. The Pomodoro technique—working for 25 minutes and resting for 5—can also boost productivity. Setting clear goals each day keeps your mind aligned with your priorities.

// Get enough quality sleep, as fatigue can severely reduce focus. Limit caffeine late in the day to avoid disrupting your rest. Lastly, take mental breaks. A short walk or simply looking away from your screen can refresh your mind.

// Improving focus takes time and consistency, but with these simple habits, you’ll sharpen your concentration and enhance your productivity naturally.



// focus, productivity, mental-clarity, self-improvement, mindfulness, habits, time-management, meditation, wellness, cognitive-health