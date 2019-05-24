from django.test import TransactionTestCase
from django.test import Client
from django.contrib.auth.models import User
from django.conf import settings


class Jwt_AuthSignupFormTestCase(TransactionTestCase):
    """
    Signup form fields tests.
    """
    def setUp(self):
        settings.DEBUG = True
        self.client = Client()

    def test_gstin(self):
        response = self.client.post('/auth/signup/', {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'mail@email.com',
            'password': 'P@s5w0rd',
            'gstin': '1234', # incorrect gstin pattern
            'mobile': '9999999999',
            'business_name': 'business_name',
            'address': {'address_name':'', 'address_line1': '', 'address_line2': '', 'state': '', 'pincode': '209801', 'country': 'INDIA'}
        })

        response_data = response.json()
        self.assertListEqual(list(response_data.keys()), ['gstin'])
        self.assertDictEqual(response_data, {'gstin': ['This value does not match the required pattern.']})

        response = self.client.post('/auth/signup/', {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'mail@email.com',
            'password': 'P@s5w0rd',
            'gstin': '', # blank gstin
            'mobile': '9999999999',
            'business_name': 'business_name',
            'address': {'address_name':'', 'address_line1': '', 'address_line2': '', 'state': '', 'pincode': '209801', 'country': 'INDIA'}
        })

        response_data = response.json()
        self.assertListEqual(list(response_data.keys()), ['gstin'])
        self.assertDictEqual(response_data, {'gstin': ['This field may not be blank.']})

        response = self.client.post('/auth/signup/', {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'mail@email.com',
            'password': 'P@s5w0rd',
            # No gstin field
            'mobile': '9999999999',
            'business_name': 'business_name',
            'address': {'address_name':'', 'address_line1': '', 'address_line2': '', 'state': '', 'pincode': '209801', 'country': 'INDIA'}
        })

        response_data = response.json()
        self.assertListEqual(list(response_data.keys()), ['gstin'])
        self.assertDictEqual(response_data, {'gstin': ['This field is required.']})
    
    def test_mobile(self):
        response = self.client.post('/auth/signup/', {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'mail@email.com',
            'password': 'P@s5w0rd',
            'gstin': '11AAAAA1111A1A1',
            'mobile': '1234', # incorrect mobile pattern
            'business_name': 'business_name',
            'address': {'address_name':'', 'address_line1': '', 'address_line2': '', 'state': '', 'pincode': '209801', 'country': 'INDIA'}
        })

        response_data = response.json()
        self.assertListEqual(list(response_data.keys()), ['mobile'])
        self.assertDictEqual(response_data, {'mobile': ['Ensure this field has at least 10 characters.', 'This value does not match the required pattern.']})

        response = self.client.post('/auth/signup/', {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'mail@email.com',
            'password': 'P@s5w0rd',
            'gstin': '11AAAAA1111A1A1',
            'mobile': '', # blank mobile
            'business_name': 'business_name',
            'address': {'address_name':'', 'address_line1': '', 'address_line2': '', 'state': '', 'pincode': '209801', 'country': 'INDIA'}
        })

        response_data = response.json()
        self.assertListEqual(list(response_data.keys()), ['mobile'])
        self.assertDictEqual(response_data, {'mobile': ['This field may not be blank.']})

        response = self.client.post('/auth/signup/', {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'mail@email.com',
            'password': 'P@s5w0rd',
            'gstin': '11AAAAA1111A1A1',
            # no mobile field
            'business_name': 'business_name',
            'address': {'address_name':'', 'address_line1': '', 'address_line2': '', 'state': '', 'pincode': '209801', 'country': 'INDIA'}
        })

        response_data = response.json()
        self.assertListEqual(list(response_data.keys()), ['mobile'])
        self.assertDictEqual(response_data, {'mobile': ['This field is required.']})
    
    def test_otherfields(self):
        response = self.client.post('/auth/signup/', {
            'first_name': '',
            'last_name': '',
            'email': 'mail@email.com',
            'password': '',
            'gstin': '11AAAAA1111A1A1',
            'mobile': '9999999999',
            'business_name': '',
            'address': ''
        })

        response_data = response.json()
        self.assertListEqual(list(response_data.keys()), ['first_name', 'address', 'business_name', 'password'])
        self.assertDictEqual(response_data, {'first_name': ['This field may not be blank.'],
                                             'address': ['This field may not be blank.'],
                                             'business_name': ['This field may not be blank.'],
                                             'password': ['This field may not be blank.']})


class Jwt_AuthAuthFlowTestCase(TransactionTestCase):
    """
    Signup Flow tests.
    """
    def setUp(self):
        settings.DEBUG = True
        self.client = Client()
        self.mobile = '9999999999'
        self.password = 'F0o|3@aR'

    def test_authflow(self):
        """
        1. Signup a user
        2. Signin the user # Signin creates a new session apart from Signup So now there are two sessions active
        3. Refresh the token
        4. Retrive all sessions list
        5. Delete all other sessions except your own # post the session_key on same url. 
        6. Signout

        ** In future handle-sessions requests will be exclusive to channels **
        """
        response = self.client.post('/auth/signup/', {
                                        'first_name': 'John',
                                        'last_name': 'Doe',
                                        'email': 'mail@email.com',
                                        'password': self.password,
                                        'gstin': '11AAAAA1111A1A1',
                                        'mobile': self.mobile,
                                        'business_name': 'busi_ness',
                                        'address': {'address_name':'', 'address_line1': '', 'address_line2': '', 'state': '', 'pincode': '209801', 'country': 'INDIA'}
                                    })

        response_data = response.json()

        self.assertListEqual(list(response_data.keys()), ['id', 'otp'])

        response = self.client.post('/auth/verify-otp/', response_data)

        response_data = response.json()
        self.assertListEqual(list(response_data.keys()), ['token', 'refresh_token', 'session_key'])
        self.assertRegexpMatches(response_data['token'], r'[0-9A-Za-z\-]+\.[0-9A-Za-z\-]+\.[0-9A-Za-z\-]+')
        self.assertRegexpMatches(response_data['refresh_token'], r'[0-9A-Za-z]{32}')
        self.assertRegexpMatches(response_data['session_key'], r'[0-9A-Za-z]{32}')

        response = self.client.post('/auth/signin/', {'id_field': self.mobile, 'password': self.password})
        auth_data = response.json()

        refresh_token = auth_data['refresh_token']
        session_key = auth_data['session_key']

        response = self.client.post('/auth/refresh/', {'refresh_token': refresh_token}, HTTP_AUTHORIZATION='JWT ' +  auth_data['token'], HTTP_X_SESSION_KEY=session_key)

        refreshed_auth_data = response.json()        
        response = self.client.get('/auth/handle-sessions/', HTTP_AUTHORIZATION='JWT ' +  refreshed_auth_data['token'], HTTP_X_SESSION_KEY=session_key)

        active_sessions = response.json()
        self.assertListEqual(list(active_sessions.keys()), ['token_list'])

        acitve_sessions_token_list = active_sessions.get('token_list')

        # end all other sessions except your own
        for session_key_iter in acitve_sessions_token_list:
            if session_key_iter != session_key:
                self.client.post('/auth/handle-sessions/', {'session_key': session_key_iter}, HTTP_AUTHORIZATION='JWT ' +  refreshed_auth_data['token'], HTTP_X_SESSION_KEY=session_key)

        # log out from own session
        self.client.get('/auth/signout/', HTTP_AUTHORIZATION='JWT ' +  refreshed_auth_data['token'], HTTP_X_SESSION_KEY=session_key)
