import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { IoClose } from "react-icons/io5";

type Props = { isOpen: boolean; onClose: () => void };

const FiltersModal = ({ isOpen, onClose }: Props) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-[199]"
            aria-hidden="true"
          />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-[200]">
            <Dialog.Panel className="bg-dark-700 p-3 rounded-md relative min-w-72">
              <div className="absolute right-1 top-1 text-xl hover:bg-dark-900 rounded-full cursor-pointer p-1">
                <IoClose />
              </div>
              <Dialog.Title className="text-xl font-medium text-center">
                Filter activities
              </Dialog.Title>

              <div></div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default FiltersModal;
