use gpui::{Hsla, Rgba, rgb};

pub struct ColorScale(pub [Hsla; 12]);

impl ColorScale {
    pub fn new(colors: [Hsla; 12]) -> Self {
        Self(colors)
    }

    pub fn shade(&self, idx: usize) -> Hsla {
        self.0[idx - 1]
    }
}

// Usage example:
// let gray = ColorScale::new(vec![
//     Hsla { h: 0.0, s: 0.0, l: 0.05, a: 1.0 },
//     Hsla { h: 0.0, s: 0.0, l: 0.15, a: 1.0 },
//     Hsla { h: 0.0, s: 0.0, l: 0.25, a: 1.0 },
//     Hsla { h: 0.0, s: 0.0, l: 0.35, a: 1.0 },
//     Hsla { h: 0.0, s: 0.0, l: 0.45, a: 1.0 },
//     Hsla { h: 0.0, s: 0.0, l: 0.55, a: 1.0 },
//     Hsla { h: 0.0, s: 0.0, l: 0.65, a: 1.0 },
//     Hsla { h: 0.0, s: 0.0, l: 0.75, a: 1.0 },
//     Hsla { h: 0.0, s: 0.0, l: 0.85, a: 1.0 },
//     Hsla { h: 0.0, s: 0.0, l: 0.95, a: 1.0 },
//     Hsla { h: 0.0, s: 0.0, l: 0.98, a: 1.0 },
//     Hsla { h: 0.0, s: 0.0, l: 1.0, a: 1.0 },
// ]);
// let color1 = gray.shade(0); // &Hsla { ... }

pub const GRAY_DARK: ColorScale = ColorScale([
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.0667,
        a: 1.0,
    }, // #111111
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.0980,
        a: 1.0,
    }, // #191919
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.1333,
        a: 1.0,
    }, // #222222
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.1647,
        a: 1.0,
    }, // #2a2a2a
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.1922,
        a: 1.0,
    }, // #313131
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.2275,
        a: 1.0,
    }, // #3a3a3a
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.2824,
        a: 1.0,
    }, // #484848
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.3765,
        a: 1.0,
    }, // #606060
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.4314,
        a: 1.0,
    }, // #6e6e6e
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.4824,
        a: 1.0,
    }, // #7b7b7b
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.7059,
        a: 1.0,
    }, // #b4b4b4
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.9333,
        a: 1.0,
    }, // #eeeeee
]);

pub const GRAY: ColorScale = ColorScale([
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.9882,
        a: 1.0,
    }, // #fcfcfc
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.9765,
        a: 1.0,
    }, // #f9f9f9
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.9412,
        a: 1.0,
    }, // #f0f0f0
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.9098,
        a: 1.0,
    }, // #e8e8e8
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.8824,
        a: 1.0,
    }, // #e0e0e0
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.8510,
        a: 1.0,
    }, // #d9d9d9
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.8078,
        a: 1.0,
    }, // #cecece
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.7333,
        a: 1.0,
    }, // #bbbbbb
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.5529,
        a: 1.0,
    }, // #8d8d8d
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.5137,
        a: 1.0,
    }, // #838383
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.3922,
        a: 1.0,
    }, // #646464
    Hsla {
        h: 0.0,
        s: 0.0,
        l: 0.1255,
        a: 1.0,
    }, // #202020
]);

pub const BASE: ColorScale = GRAY;
