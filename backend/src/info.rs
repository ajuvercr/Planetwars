use rocket::{Route};
use rocket::response::Redirect;

use rocket_contrib::templates::Template;

use crate::util::*;

const MAX: usize = 3;

#[get("/info")]
fn help_base() -> Redirect {
    Redirect::to("/info/1")
}

#[get("/info/<page>")]
async fn help(page: usize) -> Template {
    let context = Context::new_with("info", json!({
        "page": page,
        "next": if page + 1 <= MAX { Some(page + 1) } else { None },
        "prev": if page - 1 > 0 { Some(page - 1) } else { None }
    }));

    Template::render(format!("help/help_{}", page), &context)
}

pub fn fuel(routes: &mut Vec<Route>) {
    routes.extend(routes![help_base, help]);
}
