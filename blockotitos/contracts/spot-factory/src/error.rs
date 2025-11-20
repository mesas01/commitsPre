use soroban_sdk::{contracterror, symbol_short, Symbol};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum SpotFactoryError {
    /// Unauthorized: Only admin can perform this action
    Unauthorized = 1,
    /// Invalid plan: Plan type is not valid
    InvalidPlan = 2,
    /// Insufficient payment: Payment amount is less than required
    InsufficientPayment = 3,
    /// Event creation failed: Failed to create event contract
    EventCreationFailed = 4,
    /// Invalid parameters: Invalid input parameters
    InvalidParameters = 5,
    /// Event not found: Event ID does not exist
    EventNotFound = 6,
}

impl SpotFactoryError {
    pub fn to_symbol(&self) -> Symbol {
        match self {
            SpotFactoryError::Unauthorized => symbol_short!("UNAUTHORIZED"),
            SpotFactoryError::InvalidPlan => symbol_short!("INVALID_PLAN"),
            SpotFactoryError::InsufficientPayment => symbol_short!("INSUFF_PAYMENT"),
            SpotFactoryError::EventCreationFailed => symbol_short!("EVT_FAILED"),
            SpotFactoryError::InvalidParameters => symbol_short!("INVALID_PARAMS"),
            SpotFactoryError::EventNotFound => symbol_short!("EVT_NOT_FOUND"),
        }
    }
}

