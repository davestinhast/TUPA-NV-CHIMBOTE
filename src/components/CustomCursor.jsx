import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
export default function CustomCursor() {
    const [isHovered, setIsHovered] = useState(false);
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);
    useEffect(() => {
        const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        if (isTouchDevice) return;
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX - 10); 
            mouseY.set(e.clientY - 10);
        };
        const handleMouseOver = (e) => {
            const target = e.target;
            const isInteractive = target.closest('a, button, .btn, input, select, [role="button"], .card, .tupa-chip');
            setIsHovered(!!isInteractive);
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [mouseX, mouseY]);
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
        return null;
    }
    return (
        <motion.div
            className="custom-cursor"
            style={{
                x: cursorX,
                y: cursorY,
            }}
            animate={{
                scale: isHovered ? 2.5 : 1,
                backgroundColor: isHovered ? 'rgba(198, 40, 40, 0.1)' : 'rgba(198, 40, 40, 0.5)',
                mixBlendMode: isHovered ? 'multiply' : 'normal',
                border: isHovered ? '1px solid rgba(198, 40, 40, 0.8)' : '1px solid transparent'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
    );
}
