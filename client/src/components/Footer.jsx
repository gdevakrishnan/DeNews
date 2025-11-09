import React, { Fragment } from 'react'

const Footer = () => {
    return (
        <Fragment>
            <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-6">
                <aside>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved by Web 3.0, Schools of Innovation, KiTE</p>
                </aside>
            </footer>
        </Fragment>
    )
}

export default Footer
