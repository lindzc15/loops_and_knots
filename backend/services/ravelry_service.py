from repositories.ravelry_repository import RavelryRepository
from schemas.ravelry_schema import YarnResponse, YarnIDResponse, PatternsResponse, PatternBasics
from typing import List, Optional

class RavelryService:
    @staticmethod
    async def get_all_yarns() -> YarnIDResponse:
        return await RavelryRepository.get_all_yarns()
    
    @staticmethod
    async def get_yarn_details(id) -> YarnResponse:
        return await RavelryRepository.get_yarn_details(id)

    @staticmethod
    async def get_all_patterns() -> PatternsResponse:
        return await RavelryRepository.get_all_patterns()
    
    @staticmethod
    async def get_pattern_details(id) -> PatternBasics:
        return await RavelryRepository.get_pattern_details(id)
    
    @staticmethod
    async def search_patterns(query) -> PatternsResponse:
        return await RavelryRepository.search_patterns(query)
    
    @staticmethod
    async def search_yarns(query) -> YarnIDResponse:
        return await RavelryRepository.search_yarns(query)