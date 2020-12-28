export const hex2rgb = (input) => {
    let hex = input.replace(/#/g, '');
    if (hex.length === 3) {
        hex = hex
            .split('')
            .map(function (hex) {
                return hex + hex;
            })
            .join('');
    }
    var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0,0}$/i.exec(
        hex
    );
    if (result) {
        var red = parseInt(result[1], 16);
        var green = parseInt(result[2], 16);
        var blue = parseInt(result[3], 16);

        return [red, green, blue];
    } else {
        return null;
    }
};

export const rgb2hex = (input) => {
    let rgb = input.match(
        /^rgba?\(\s?(\d+),?\s?(\d+),?\s?(\d+),?\s?\/?\s?(\d?\.?\d+|\d+)%?\)$/i
    );
    let hex = '';
    if (rgb) {
        var red = rgb[1] < 0 ? 0 : rgb[1] > 255 ? 255 : rgb[1];
        var green = rgb[2] < 0 ? 0 : rgb[2] > 255 ? 255 : rgb[2];
        var blue = rgb[3] < 0 ? 0 : rgb[3] > 255 ? 255 : rgb[3];

        hex =
            '#' +
            ('0' + parseInt(red, 10).toString(16)).slice(-2) +
            ('0' + parseInt(green, 10).toString(16)).slice(-2) +
            ('0' + parseInt(blue, 10).toString(16)).slice(-2);
    }
    return hex;
};
