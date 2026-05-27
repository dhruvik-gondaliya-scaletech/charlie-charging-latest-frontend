"use client";

import React, { useEffect, useState } from "react";
import { PopupModal } from "react-calendly";
import { Button } from "@/components/ui/button";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "";

interface ICalendlyButton {
    title?: string;
    className?: string;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function BookADemo(props: ICalendlyButton) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [rootEl, setRootEl] = useState<HTMLElement | null>(null);
    const { title = "Book a Demo", className, children, onClick, isOpen: externalIsOpen, onClose } = props;

    useEffect(() => {
        const el = document.getElementById("__next") || document.body;
        setRootEl(el);
    }, []);

    const isControlled = externalIsOpen !== undefined;
    const isOpen = isControlled ? externalIsOpen : internalIsOpen;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onClick) {
            onClick(e);
        }
        if (!isControlled) {
            setInternalIsOpen(true);
        }
    };

    let triggerElement: React.ReactNode = null;

    if (children) {
        if (React.isValidElement(children)) {
            const child = children as React.ReactElement<any>;
            triggerElement = React.cloneElement(child, {
                onClick: (e: React.MouseEvent) => {
                    if (child.props.onClick) {
                        child.props.onClick(e);
                    }
                    handleClick(e);
                },
            });
        } else {
            triggerElement = (
                <span onClick={handleClick} className={className} style={{ cursor: 'pointer' }}>
                    {children}
                </span>
            );
        }
    } else if (!isControlled) {
        triggerElement = (
            <Button
                title={title}
                onClick={handleClick}
                className={`${className} animate-fadeIn font-space-grotesk font-bold tracking-wider uppercase`}
            >
                {title}
            </Button>
        );
    }

    const handleClose = () => {
        if (isControlled && onClose) {
            onClose();
        } else {
            setInternalIsOpen(false);
        }
    };

    return (
        <>
            {triggerElement}
            {rootEl && (
                <PopupModal
                    url={CALENDLY_URL}
                    onModalClose={handleClose}
                    open={isOpen}
                    rootElement={rootEl}
                />
            )}
        </>
    );
}