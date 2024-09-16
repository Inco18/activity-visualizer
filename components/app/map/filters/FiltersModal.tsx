"use client";
import { Dialog, Transition } from "@headlessui/react";
import "rc-slider/assets/index.css";
import React, { Fragment } from "react";
import { IoClose } from "react-icons/io5";
import DateFilter from "./DateFilter";
import TypeFilter from "./TypeFilter";
import DistanceFilter from "./DistanceFilter";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const FiltersModal = ({ isOpen, onClose }: Props) => {
  const handleCloseDiscard = () => {
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={handleCloseDiscard}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div
            className="fixed inset-0 bg-black/40 z-[1990]"
            aria-hidden="true"
          />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="-translate-x-96"
          enterTo="translate-x-0"
          leave="ease-in duration-200"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-96">
          <div className="fixed left-0 top-0 flex items-center justify-center z-[2000] ">
            <Dialog.Panel className="bg-dark-700 p-3 rounded-md relative min-w-96">
              <div
                onClick={handleCloseDiscard}
                className="absolute right-1 top-1 text-xl hover:bg-dark-900 rounded-full cursor-pointer p-1">
                <IoClose />
              </div>
              <Dialog.Title className="text-xl font-medium text-center">
                Filter activities
              </Dialog.Title>

              <div className="flex flex-col items-center gap-2">
                <DateFilter />
                <TypeFilter />
                <DistanceFilter />
                <button className="bg-strava rounded-md px-7 py-2 hover:bg-opacity-80 transition-all">
                  Filter
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default FiltersModal;
