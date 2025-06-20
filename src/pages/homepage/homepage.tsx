import React from 'react';
import './homepage.styles.css';
import ChoicesLabel from '../../shared/components/choicesLabel/choicesLabel.tsx';
import { getDailyMessageHelper } from '../../shared/helpers/getDailyMessagesHelper.ts';


export default function Homepage() {
    return (
    <div className='homepage-container'>
        <div className='homepage-container__top'>
            <span className='homepage-container__top__title'>Marinuta's App</span>
            <span className='homepage-container__top__subtitle'>Daily's quote from Dudu: {getDailyMessageHelper()}</span>
        </div>
        <div className='homepage_container__services'>
            <div className='homepage_container__services__right'>
                <ChoicesLabel name={'Link Checker'} link={'/link-checker'} />
                <ChoicesLabel name={'Investigation Helper'} link={'/investigation-helper'} /> 
                <ChoicesLabel name={'Resume a site'} link={'/summarize-articles'} />
            </div>
            <div className='homepage_container__services__left'>
                <ChoicesLabel name={'PEP Creator'} link={'/pep-creator'} />
                <ChoicesLabel name={'Consuls/Ambassadors'} link={'/consuls'} /> 
                <ChoicesLabel name={'AM/ENF'} link={'/am-enf'} />
            </div>
        </div>
    </div>
    )
}