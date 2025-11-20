#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, U64};

mod contract;
mod error;

pub use contract::SpotEvent;
use error::SpotEventError;

#[cfg(test)]
mod test;

