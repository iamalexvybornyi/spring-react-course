import axios from 'axios';
import * as apiCalls from './apiCalls'

describe('apiCalls', () => {
    describe('signUp', () => {
        it('calls the api/1.0/users', () => {
            const mockSignUp = jest.fn();
            axios.post = mockSignUp;
            apiCalls.signUp();

            const path = mockSignUp.mock.calls[0][0];
            expect(path).toBe('/api/1.0/users');
        });
    });
});