import React, { useState } from 'react';
import { IonItem, IonLabel, IonIcon, IonActionSheet } from '@ionic/react';
import { languageOutline, checkmarkOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, LanguageCode } from '../../i18n';

/**
 * Komponent wyboru języka aplikacji
 */
const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [showActionSheet, setShowActionSheet] = useState(false);

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  const handleLanguageChange = async (code: LanguageCode) => {
    await i18n.changeLanguage(code);
    setShowActionSheet(false);
  };

  return (
    <>
      <IonItem button onClick={() => setShowActionSheet(true)}>
        <IonIcon icon={languageOutline} slot="start" />
        <IonLabel>
          <h2>{t('settings.language')}</h2>
          <p>
            {currentLanguage.flag} {currentLanguage.name}
          </p>
        </IonLabel>
      </IonItem>

      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        header={t('settings.language')}
        buttons={[
          ...LANGUAGES.map((lang) => ({
            text: `${lang.flag} ${lang.name}`,
            icon: lang.code === i18n.language ? checkmarkOutline : undefined,
            handler: () => handleLanguageChange(lang.code),
          })),
          {
            text: t('common.cancel'),
            role: 'cancel',
          },
        ]}
      />
    </>
  );
};

export default LanguageSelector;
