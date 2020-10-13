import React, { useState, useRef, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Form, {
    Item,
    Label,
    ButtonItem,
    ButtonOptions,
    RequiredRule,
    CustomRule,
    EmailRule
} from 'devextreme-react/form';
import notify from 'devextreme/ui/notify';
import LoadIndicator from 'devextreme-react/load-indicator';
import { createAccount } from '../../api/auth';
import './create-account-form.scss';

export default function (props) {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const formData = useRef({});

    const onSubmit = useCallback(async (e) => {
        e.preventDefault();
        const { email, password } = formData.current;
        setLoading(true);

        const result = await createAccount(email, password);
        setLoading(false);

        if (result.isOk) {
            history.push('/login');
        } else {
            notify(result.message, 'error', 2000);
        }
    }, [history]);

    const confirmPassword = useCallback(
        ({ value }) => value === formData.current.password,
        []
    );

    return (
        <form className={ 'create-account-form' } onSubmit={ onSubmit }>
            <Form formData={ formData.current } disabled={ loading }>
                <Item
                    dataField={ 'email' }
                    editorType={ 'dxTextBox' }
                    editorOptions={ emailEditorOptions }
                >
                    <RequiredRule message="Требуется адрес почты"/>
                    <EmailRule message="Неверный адрес почты"/>
                    <Label visible={ false }/>
                </Item>
                <Item
                    dataField={ 'password' }
                    editorType={ 'dxTextBox' }
                    editorOptions={ passwordEditorOptions }
                >
                    <RequiredRule message="Требуется пароль"/>
                    <Label visible={ false }/>
                </Item>
                <Item
                    dataField={ 'confirmedPassword' }
                    editorType={ 'dxTextBox' }
                    editorOptions={ confirmedPasswordEditorOptions }
                >
                    <RequiredRule message="Требуется пароль"/>
                    <CustomRule
                        message={ 'Пароль не соответствует учетной записи' }
                        validationCallback={ confirmPassword }
                    />
                    <Label visible={ false }/>
                </Item>
                <Item>
                    <div className='policy-info'>
                        Создавая учетную запись, вы соглашаетесь с <Link to="#">Terms of Service</Link> и <Link to="#">Privacy
                        Policy</Link>
                    </div>
                </Item>
                <ButtonItem>
                    <ButtonOptions
                        width={ '100%' }
                        type={ 'default' }
                        useSubmitBehavior={ true }
                    >
            <span className="dx-button-text">
              {
                  loading
                      ? <LoadIndicator width={ '24px' } height={ '24px' } visible={ true }/>
                      : 'Создать аккаунт'
              }
            </span>
                    </ButtonOptions>
                </ButtonItem>
                <Item>
                    <div className={ 'login-link' }>
                        Уже есть учетная запись? <Link to={ '/login' }>Вход</Link>
                    </div>
                </Item>
            </Form>
        </form>
    );
}

const emailEditorOptions = { stylingMode: 'filled', placeholder: 'Электронная почта', mode: 'email' };
const passwordEditorOptions = { stylingMode: 'filled', placeholder: 'Пароль', mode: 'password' };
const confirmedPasswordEditorOptions = { stylingMode: 'filled', placeholder: 'Подтверждение пароля', mode: 'password' };
