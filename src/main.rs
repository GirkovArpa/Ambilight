#![windows_subsystem="windows"]
#[macro_use] extern crate sciter;
struct EventHandler;
impl EventHandler {}
impl sciter::EventHandler for EventHandler {}
fn main() {
    sciter::set_options(sciter::RuntimeOptions::DebugMode(true)).unwrap();
    let archived = include_bytes!("../target/assets.rc");
    sciter::set_options(sciter::RuntimeOptions::ScriptFeatures(
        sciter::SCRIPT_RUNTIME_FEATURES::ALLOW_SYSINFO  as u8 |
        sciter::SCRIPT_RUNTIME_FEATURES::ALLOW_FILE_IO  as u8
    )).unwrap();
    let mut frame = sciter::Window::new();
    frame.event_handler(EventHandler {});
    frame.archive_handler(archived).unwrap();
    frame.load_file("this://app/main.htm");
    frame.run_app();
}