function MapIcon(props) {
    const { className } = props;

    return (
        <>
            <svg
                className={className}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M6.368 2.79L6.05146 3.73858C6.49149 3.88542 6.97473 3.71036 7.21863 3.31577C7.46252 2.92118 7.40303 2.41066 7.07494 2.08272L6.368 2.79ZM3.632 1.877L3.94854 0.928421L3.948 0.928241L3.632 1.877ZM1 3.775L2 3.775L2 3.77476L1 3.775ZM1 15.558L2 15.5582V15.558H1ZM2.368 17.456L2.68416 16.5073L2.684 16.5072L2.368 17.456ZM6.368 18.789L6.05184 19.7377L6.052 19.7378L6.368 18.789ZM7.632 18.789L7.948 19.7378L7.94811 19.7377L7.632 18.789ZM12.368 17.211L12.052 16.2622L12.0519 16.2623L12.368 17.211ZM13.632 17.211L13.9482 16.2623L13.948 16.2622L13.632 17.211ZM16.368 18.123L16.0518 19.0717L16.052 19.0718L16.368 18.123ZM19 16.224L18 16.224L18 16.2247L19 16.224ZM19 4.442L18 4.44159V4.442H19ZM17.633 2.544L17.9495 1.59541L17.9492 1.59529L17.633 2.544ZM13.633 1.211L13.3168 2.15968L13.3168 2.15971L13.633 1.211ZM12.368 1.211L12.684 2.15974L12.6843 2.15968L12.368 1.211ZM7.631 2.789L7.947 3.73776L7.94705 3.73774L7.631 2.789ZM6.367 2.789L6.683 1.84024C6.24299 1.69369 5.75995 1.8689 5.51622 2.26347C5.2725 2.65804 5.33204 3.16841 5.66006 3.49628L6.367 2.789ZM6.68454 1.84142L3.94854 0.928421L3.31546 2.82558L6.05146 3.73858L6.68454 1.84142ZM3.948 0.928241C3.497 0.778029 3.01676 0.737137 2.54686 0.808938L2.84895 2.78599C3.00559 2.76206 3.16567 2.77569 3.316 2.82576L3.948 0.928241ZM2.54686 0.808938C2.07696 0.880739 1.63085 1.06318 1.24528 1.34121L2.41509 2.96342C2.54362 2.87074 2.69232 2.80993 2.84895 2.78599L2.54686 0.808938ZM1.24528 1.34121C0.859722 1.61925 0.54575 1.98493 0.329241 2.40812L2.10975 3.31905C2.18192 3.17799 2.28657 3.0561 2.41509 2.96342L1.24528 1.34121ZM0.329241 2.40812C0.112733 2.83131 -0.000114388 3.29988 8.7016e-08 3.77524L2 3.77476C1.99996 3.61631 2.03758 3.46011 2.10975 3.31905L0.329241 2.40812ZM5.80188e-08 3.775V15.558H2V3.775H5.80188e-08ZM8.70113e-08 15.5578C-0.000151592 16.1877 0.197968 16.8016 0.566273 17.3126L2.18876 16.1432C2.06599 15.9729 1.99995 15.7682 2 15.5582L8.70113e-08 15.5578ZM0.566273 17.3126C0.93458 17.8236 1.45439 18.2057 2.052 18.4048L2.684 16.5072C2.48479 16.4409 2.31152 16.3135 2.18876 16.1432L0.566273 17.3126ZM2.05184 18.4047L6.05184 19.7377L6.68416 17.8403L2.68416 16.5073L2.05184 18.4047ZM6.052 19.7378C6.66738 19.9427 7.33262 19.9427 7.948 19.7378L7.316 17.8402C7.11087 17.9086 6.88913 17.9086 6.684 17.8402L6.052 19.7378ZM7.94811 19.7377L12.6841 18.1597L12.0519 16.2623L7.31589 17.8403L7.94811 19.7377ZM12.684 18.1598C12.8891 18.0914 13.1109 18.0914 13.316 18.1598L13.948 16.2622C13.3326 16.0573 12.6674 16.0573 12.052 16.2622L12.684 18.1598ZM13.3158 18.1597L16.0518 19.0717L16.6842 17.1743L13.9482 16.2623L13.3158 18.1597ZM16.052 19.0718C16.5031 19.222 16.9835 19.2629 17.4535 19.191L17.1512 17.214C16.9945 17.2379 16.8344 17.2243 16.684 17.1742L16.052 19.0718ZM17.4535 19.191C17.9235 19.1191 18.3697 18.9366 18.7553 18.6583L17.5851 17.0364C17.4566 17.1292 17.3078 17.19 17.1512 17.214L17.4535 19.191ZM18.7553 18.6583C19.1409 18.3801 19.4549 18.0143 19.6713 17.5909L17.8904 16.6806C17.8183 16.8217 17.7136 16.9437 17.5851 17.0364L18.7553 18.6583ZM19.6713 17.5909C19.8877 17.1675 20.0004 16.6987 20 16.2233L18 16.2247C18.0001 16.3832 17.9626 16.5395 17.8904 16.6806L19.6713 17.5909ZM20 16.224V4.442H18V16.224H20ZM20 4.44241C20.0003 3.8127 19.8024 3.19887 19.4343 2.6879L17.8114 3.85676C17.9341 4.02708 18.0001 4.23169 18 4.44159L20 4.44241ZM19.4343 2.6879C19.0663 2.17692 18.5468 1.79471 17.9495 1.59541L17.3165 3.49259C17.5156 3.55903 17.6888 3.68643 17.8114 3.85676L19.4343 2.6879ZM17.9492 1.59529L13.9492 0.262293L13.3168 2.15971L17.3168 3.49271L17.9492 1.59529ZM13.9493 0.262324C13.3334 0.0570276 12.6676 0.0570276 12.0518 0.262324L12.6843 2.15968C12.8895 2.09124 13.1115 2.09124 13.3168 2.15968L13.9493 0.262324ZM12.052 0.262257L7.31495 1.84026L7.94705 3.73774L12.684 2.15974L12.052 0.262257ZM7.315 1.84024C7.10987 1.90856 6.88813 1.90856 6.683 1.84024L6.051 3.73776C6.66638 3.94272 7.33162 3.94272 7.947 3.73776L7.315 1.84024ZM5.66006 3.49628L5.66106 3.49728L7.07494 2.08272L7.07394 2.08172L5.66006 3.49628ZM6 3V19H8V3H6ZM12 1V17H14V1H12Z" />
            </svg>
        </>
    );
}

export default MapIcon;
