import React, { useEffect } from "react";
import "./eye.css";

const Eyes = () => {
    useEffect(() => {
        const handleMouseMove = (event) => {
            const balls = document.querySelectorAll(".balls");
            balls.forEach((ball) => {
                const x = ball.getBoundingClientRect().left + ball.clientWidth / 2;
                const y = ball.getBoundingClientRect().top + ball.clientHeight / 2;
                const radian = Math.atan2(event.pageX - x, event.pageY - y);
                const rotate = radian * (180 / Math.PI) * -1 + 270;
                ball.style.transform = `rotate(${rotate}deg)`;
            });
        };

        document.body.addEventListener("mousemove", handleMouseMove);
        return () => document.body.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="wrapper">
            <div className="balls"></div>
            <div className="balls"></div>
        </div>
    );
};

export default Eyes;