function Footer() {
    return (
        <footer
            className="bg-white dark:bg-gray-900 dark:rounded-none rounded-lg m-4 my-0 w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-black-500 sm:text-center dark:text-gray-400">© 2024
                    <a href='/' className="hover:underline"> HomeHaven</a>. All Rights Reserved.
                </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-black-500 dark:text-gray-400 sm:mt-0">
                <li>
                    <a href="#" className="hover:underline me-4 md:me-6">About</a>
                </li>
                <li>
                    <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                </li>
                <li>
                    <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
                </li>
                <li>
                    <a href="#" className="hover:underline">Contact</a>
                </li>
            </ul>
        </footer>
    )
}

export default Footer;