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
}

export default function BookADemo(props: ICalendlyButton) {
    const [isOpen, setIsOpen] = useState(false);
    const [rootEl, setRootEl] = useState<HTMLElement | null>(null);
    const { title = "Book a Demo", className, children, onClick } = props;

    useEffect(() => {
        const el = document.getElementById("__next") || document.body;
        setRootEl(el);
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onClick) {
            onClick(e);
        }
        setIsOpen(true);
    };

    let triggerElement: React.ReactNode;

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
    } else {
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

    return (
        <>
            {triggerElement}
            {rootEl && (
                <PopupModal
                    url={CALENDLY_URL}
                    onModalClose={() => setIsOpen(false)}
                    open={isOpen}
                    rootElement={rootEl}
                />
            )}
        </>
    );
}