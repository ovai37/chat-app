import { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Create Room", path: "/create" },
    { name: "Join Room", path: "/join" },
  ];

  const linkClass = (path: string) =>
    `rounded-lg px-4 py-2 transition ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <>
      <header className="border-b border-slate-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-bold sm:text-2xl">
            ShareRoom
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-3 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={linkClass(link.path)}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile */}
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 hover:bg-slate-800 md:hidden"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="transform transition duration-200"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition duration-150"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="flex h-full w-72 flex-col bg-slate-900 p-6">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Menu</h2>

                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-2 hover:bg-slate-800"
                  >
                    <X size={22} />
                  </button>
                </div>

                <nav className="flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setOpen(false)}
                      className={linkClass(link.path)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
