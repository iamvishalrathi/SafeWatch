import { useEffect } from "react";
import { NavLink } from "react-router-dom";

const RippleButton = (props) => {
  const handleClick = (e) => {
    const button = e.currentTarget;
    const x = e.clientX - button.offsetLeft;
    const y = e.clientY - button.offsetTop;
    const ripples = document.createElement("span");
    ripples.style.left = `${x}px`;
    ripples.style.top = `${y}px`;
    button.appendChild(ripples);
    setTimeout(() => {
      ripples.remove();
    }, 1000);
  };

  useEffect(() => {
    let btn = document.querySelector("button");
    const maxTranslate = 15;

    btn.addEventListener("mousemove", (e) => {
      let x = e.offsetX;
      let y = e.offsetY;
      let btnWidth = btn.clientWidth;
      let btnHeight = btn.clientHeight;
      let transX = (x - btnWidth / 2) / (btnWidth / maxTranslate);
      let transY = (y - btnHeight / 2) / (btnHeight / maxTranslate);
      btn.style.transform = `translateX(${transX}px) translateY(${transY}px)`;
    });

    btn.addEventListener("mouseout", () => {
      btn.style.transform = "";
    });
    return () => {
      btn.removeEventListener("mousemove", () => {});
      btn.removeEventListener("mouseout", () => {});
    };
  }, []);

  // Use the route prop if provided, otherwise default to "/signin"
  const route = props.route || "/signin";

  return (
    <NavLink to={route}>
      <button className="ripple-button mx-2" onClick={handleClick}>
        {props.text}
      </button>
    </NavLink>
  );
};

export default RippleButton;
