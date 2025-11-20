use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env, String, Vec, Map, U64};

use crate::error::SpotFactoryError;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Events(Vec<String>), // Lista de event IDs
    EventInfo(String),   // Info de un evento específico
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EventInfo {
    pub id: String,
    pub contract_address: Address,
    pub creator: Address,
    pub name: String,
    pub created_at: U64,
}

#[contract]
pub struct SpotFactory;

#[contractimpl]
impl SpotFactory {
    /// Constructor: Initialize the factory with an admin
    pub fn __constructor(e: &Env, admin: Address) {
        admin.require_auth();
        e.storage().instance().set(&DataKey::Admin, &admin);
        
        // Initialize empty events list
        let events: Vec<String> = Vec::new(&e);
        e.storage().instance().set(&DataKey::Events(events.clone()), &events);
    }

    /// Get the admin address
    pub fn admin(e: &Env) -> Result<Address, SpotFactoryError> {
        e.storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(SpotFactoryError::Unauthorized)
    }

    /// Update admin (only current admin can update)
    pub fn set_admin(e: &Env, new_admin: Address) -> Result<(), SpotFactoryError> {
        let admin = Self::admin(e)?;
        admin.require_auth();
        
        e.storage().instance().set(&DataKey::Admin, &new_admin);
        Ok(())
    }

    /// Create a new event
    /// This will deploy a new Event contract instance
    /// 
    /// # Arguments
    /// * `creator` - Address of the event creator
    /// * `event_name` - Name of the event
    /// * `max_nfts` - Maximum number of NFTs that can be minted
    /// * `metadata_uri` - URI pointing to event metadata JSON
    /// 
    /// # Returns
    /// The contract address of the newly created event
    pub fn create_event(
        e: &Env,
        creator: Address,
        event_name: String,
        max_nfts: u32,
        metadata_uri: String,
    ) -> Result<Address, SpotFactoryError> {
        creator.require_auth();

        // Validate parameters
        if max_nfts == 0 {
            return Err(SpotFactoryError::InvalidParameters);
        }

        // TODO: Deploy event contract using deployer
        // For now, this is a placeholder structure
        // In production, this would:
        // 1. Deploy the event contract WASM
        // 2. Initialize it with the event parameters
        // 3. Store the event info
        
        // Generate event ID (simplified - in production use proper ID generation)
        let event_id = format!("event_{}", e.ledger().timestamp());
        let event_id_str = String::from_str(e, &event_id);

        // TODO: Actual contract deployment will happen here
        // let event_wasm_hash = BytesN::<32>::from_array(e, &[0u8; 32]); // Placeholder
        // let event_contract = e.deployer().deploy_contract(event_wasm_hash, creator.clone());
        
        // For now, return a placeholder address
        // In production, this will be the actual deployed contract address
        let event_address = creator.clone(); // Placeholder

        // Store event info
        let event_info = EventInfo {
            id: event_id_str.clone(),
            contract_address: event_address.clone(),
            creator: creator.clone(),
            name: event_name.clone(),
            created_at: U64::from(e.ledger().timestamp()),
        };

        e.storage()
            .instance()
            .set(&DataKey::EventInfo(event_id_str.clone()), &event_info);

        // Add to events list
        let mut events: Vec<String> = e
            .storage()
            .instance()
            .get(&DataKey::Events(Vec::new(e)))
            .unwrap_or_else(|| Vec::new(e));
        events.push_back(event_id_str);
        e.storage().instance().set(&DataKey::Events(Vec::new(e)), &events);

        Ok(event_address)
    }

    /// Get event information by ID
    pub fn get_event_info(e: &Env, event_id: String) -> Result<EventInfo, SpotFactoryError> {
        e.storage()
            .instance()
            .get(&DataKey::EventInfo(event_id))
            .ok_or(SpotFactoryError::EventNotFound)
    }

    /// Get all event IDs
    pub fn get_events(e: &Env) -> Vec<String> {
        e.storage()
            .instance()
            .get(&DataKey::Events(Vec::new(e)))
            .unwrap_or_else(|| Vec::new(e))
    }
}

