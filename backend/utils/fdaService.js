// ============================================================
// USFDA (openFDA) API Service
// Handles fetching authoritative medicine details from FDA
// ============================================================

/**
 * Fetches medicine details from the free openFDA API.
 * Returns null if no exact or close match is found.
 * @param {string} medicineName - The name of the medicine to search.
 * @returns {Promise<Object|null>} - FDA data object or null.
 */
const fetchFDADetails = async (medicineName) => {
  try {
    console.log(`🔍 Querying openFDA API for: "${medicineName}"`);
    
    // Clean up the medicine name (e.g., take the first word or main name for better matching)
    // Often "Aspirin 500mg" might fail, so we might try a generic search first.
    const searchQuery = encodeURIComponent(medicineName.trim());
    
    // openFDA API endpoint: searching generic or brand name, limiting to 1 result.
    const url = `https://api.fda.gov/drug/label.json?search="${searchQuery}"&limit=1`;
    
    // Add a 2.5 second timeout so it doesn't slow down the response
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`⚠️ No FDA records found for: "${medicineName}"`);
        return null;
      }
      console.warn(`⚠️ openFDA API returned status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (data && data.results && data.results.length > 0) {
      console.log(`✅ USFDA details found for: "${medicineName}"`);
      const result = data.results[0];
      
      // Extract relevant authoritative information
      // openFDA returns arrays of strings for most of these fields
      return {
        brand_name: result.openfda?.brand_name?.[0] || "",
        generic_name: result.openfda?.generic_name?.[0] || "",
        manufacturer_name: result.openfda?.manufacturer_name?.[0] || "",
        active_ingredient: result.active_ingredient || result.openfda?.substance_name || [],
        purpose: result.purpose || [],
        indications_and_usage: result.indications_and_usage || [],
        warnings: result.warnings || [],
        do_not_use: result.do_not_use || [],
        stop_use: result.stop_use || [],
        dosage_and_administration: result.dosage_and_administration || [],
        pregnancy_or_breast_feeding: result.pregnancy_or_breast_feeding || [],
        storage_and_handling: result.storage_and_handling || [],
        inactive_ingredient: result.inactive_ingredient || [],
      };
    }
    
    return null;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(`⏳ openFDA Fetch timed out (2.5s) for "${medicineName}". Falling back to AI.`);
    } else {
      console.error(`❌ openFDA Fetch Error: ${error.message}`);
    }
    return null; // Gracefully fallback to AI if API fails
  }
};

module.exports = {
  fetchFDADetails,
};
