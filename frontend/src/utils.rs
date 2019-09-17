pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

use octoon_math::{Vec3};

/// this is total extra, so it the planet viewbox is like 100px wide, it will now be in total 110 pixels wide
static VIEWBOX_SCALE: f64 = 0.1;

pub static COLORS: [[f64; 3]; 10] = [
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
];

use super::types;

pub fn caclulate_viewbox(planets: &Vec<types::Planet>) -> Vec<f64> {
    let mut iter = planets.iter();

    let init = match iter.next() {
        Some(p) => (p.x, p.y, p.x, p.y),
        None => return vec![0.0, 0.0, 0.0, 0.0],
    };
    let (min_x, min_y, max_x, max_y) = planets
        .iter()
        .fold(init, |(min_x, min_y, max_x, max_y), p| (min_x.min(p.x), min_y.min(p.y), max_x.max(p.x), max_y.max(p.y)));

    let (width, height) = (max_x - min_x, max_y - min_y);
    let (dx, dy) = (VIEWBOX_SCALE * width, VIEWBOX_SCALE * height);

    vec![min_x - dx/2.0, min_y - dy/2.0, width + dx, height + dy]
}

pub fn get_planets(planets: &Vec<types::Planet>, r: f64) -> Vec<Vec3<f64>> {
    planets.iter().map(|p| Vec3::new(p.x, p.y, r)).collect()
}
