import { useNavigate } from 'react-router-dom';
import { useMyTeam } from '../hooks/useTeam';
import { useCurrentUser } from '../hooks/useAuth';
import '../styles/Button.css'

interface NameButtonProps {
  onClick?: () => void;
}

interface LoginProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function NameButton({ onClick }: NameButtonProps) {
  const navigate = useNavigate();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
   const { data: team, isLoading: isTeamLoading } = useMyTeam();

  // Ждем загрузку пользователя
  if (isUserLoading) {
    return (
      <button className="button button-middle" disabled>
        <p className="button-text button-text-small">Загрузка...</p>
      </button>
    );
  }

  // Нет пользователя - не показываем кнопку
  if (!user) {
    return null;
  }

  // Если у пользователя есть team_id - запрашиваем команду
  const hasTeam = user.team_id !== null && user.team_id !== undefined;
  

  // Если есть team_id, но команда еще грузится
  if (hasTeam && isTeamLoading) {
    return (
      <button className="button button-middle" disabled>
        <p className="button-text button-text-small">Загрузка...</p>
      </button>
    );
  }

  // Если есть команда - показываем название
  if (hasTeam && team) {
    return (
      <button className="button button-middle" onClick={() => navigate('/team-profile')}>
        <p className="button-text button-text-small">{team.name}</p>
      </button>
    );
  }

  // Нет команды (team_id === null) - показываем "Найти команду"
  return (
    <button className="button button-middle" onClick={onClick}>
      <p className="button-text button-text-small">Найти команду</p>
    </button>
  );
}

export function CreatePlusButton({ onClick }: ButtonProps) {
  return (
    <div>
      <button className="button button-small" onClick={onClick}>
        <span className='button-text button-text-small'>
          Создать
          <svg className="create-plus-icon" width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.53386 0V17M17.4233 8H0" stroke="#191919" strokeWidth="2" />
          </svg>
        </span>
      </button>
    </div>
  );
}
export function CreateButton({ onClick }: ButtonProps) { 
  return (
    <button className="button button-small drop-shadow" onClick={onClick}> 
    <p className='button-text button-text-small'> 
      Создать
    </p>
    </button>
  );
}

export function SendReportButton({ onClick }: ButtonProps) {
  return (
    <button className="button button-small drop-shadow" onClick={onClick}>
      <p className="button-text button-text-small">
        Отправить отчёт
      </p>
    </button>
  );
}
export function SendButton() {
  return (
    <button className="send-button">
      Отправить
    </button>
  );
}

export function CancelButton({ onClick }: ButtonProps) { 
  return (
    <button className="button-close button-small drop-shadow" onClick={onClick}> 
    <p className='button-text button-text-small'> 
      Отмена
    </p>
    </button>
  );
}

export function CheckInButton({ onClick }: ButtonProps) { 
  return (
    <button className="button button-small drop-shadow" onClick={onClick}> 
    <p className='button-text button-text-small'> 
      Check-in
    </p>
    </button>
  );
}

export function Import({ onClick }: ButtonProps) { 
  return (
    <button className="button button-small drop-shadow" onClick={onClick}> 
    <p className='button-text button-text-small'> 
      Импорт
    </p>
    </button>
  );
}

export function StudentButton({ onClick }: ButtonProps) { 
  return ( 
    <button className="button button-big drop-shadow" onClick={onClick}> 
    <p className='button-text button-text-big'> 
      Студент 
      </p>   
    </button> 
  ); 
}

export function AdminButton({ onClick }: ButtonProps) { 
  return (
    <button className="button button-big drop-shadow" onClick={onClick}>
      <p className='button-text button-text-big'> 
        Администратор
      </p>   
    </button>
  );
}

export function RegisterButton({ onClick }: ButtonProps) { 
  return (
    <button className="button button-big drop-shadow" onClick={onClick}>
      <p className='button-text button-text-big'> 
        Зарегистрироваться
      </p>   
    </button>
  );
}

export function LoginButton({ onClick, disabled }: LoginProps) { 
  return (
    <button 
      className="button button-big drop-shadow" 
      onClick={onClick}
      disabled={disabled}
      type="submit"
    >
      <p className='button-text button-text-big'> 
        {disabled ? 'Вход...' : 'Войти'}
      </p>
    </button>
  );
}


interface JoinButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function JoinButton({ onClick, disabled }: JoinButtonProps) {
  return (
    <button 
      className="button button-small drop-shadow"
      onClick={onClick}
      disabled={disabled}
    >
    <p className="button-text button-text-small">
      Вступить
    </p>
    </button>
  );
}

export function ApplicationSentButton() {
  return (
    <button className="application-sent-button">
      Заявка отправлена
    </button>
  );
}

export function PostAnnouncementButton({ onClick }: ButtonProps) {
  return (
    <button className="button button-middle drop-shadow" onClick={onClick}>
      <p className='button-text button-text-big'> 
        Опубликовать объявление
          <svg className="create-plus-icon" width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.53386 0V17M17.4233 8H0" stroke="#191919" strokeWidth="2" />
          </svg>
      </p>
    </button>
  );
}

export function CreateEventButton({ onClick }: ButtonProps) { 
  return (
    <button className="button button-middle drop-shadow"onClick={onClick}>
    <p className='button-text button-text-big'> 
      Создать мероприятие
          <svg className="create-plus-icon" width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.53386 0V17M17.4233 8H0" stroke="#191919" strokeWidth="2" />
          </svg>
    </p>
    </button>
  );
}

export function CreateChallengeButton({ onClick }: ButtonProps) { 
  return (
    <button className="button button-middle drop-shadow"onClick={onClick}>
    <p className='button-text button-text-small'> 
      Создать челлендж
          <svg className="create-plus-icon" width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.53386 0V17M17.4233 8H0" stroke="#191919" strokeWidth="2" />
          </svg>
    </p>
    </button>
  );
}

export function CreateSletter({ onClick }: ButtonProps) { 
  return (
    <button className="button button-big drop-shadow"onClick={onClick}>
      <p className='button-text button-text-big'> 
        Создать рассылку
          <svg className="create-plus-icon" width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.53386 0V17M17.4233 8H0" stroke="#191919" strokeWidth="2" />
          </svg>
      </p>
    </button>
  );
}



export function ReplyButton({ onClick }: ButtonProps) {
  return (
    <button className="button button-small drop-shadow" onClick={onClick}>
      <p className="button-text button-text-small">
        Откликнуться
      </p>
    </button>
  );
}

interface PublishButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function PublishButton({ onClick, disabled }: PublishButtonProps) {
  return (
    <button className="button button-small drop-shadow" onClick={onClick} disabled={disabled}>
      <p className="button-text button-text-small">
        Опубликовать
      </p>
    </button>
  );
}


export function DetailsButton({ onClick, disabled }: ModerationButtonProps) {
  return (
    <button
      className="cm-moderation-details-button"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      Подробнее
    </button>
  );
}

export function ModerationDeleteButton({ onClick, disabled }: ModerationButtonProps) {
  return (
    <button
      className="cm-moderation-market-delete"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      Удалить
    </button>
  );
}

export function ModerationPublishButton({ onClick, disabled }: ModerationButtonProps) {
  return (
    <button
      className="cm-moderation-market-publish"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      Опубликовать
    </button>
  );
}

export function EventDeleteButton({ onClick, disabled }: ModerationButtonProps) {
  return (
    <button
      className="cm-moderation-event-delete"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      Удалить
    </button>
  );
}

export function ReportRejectButton({ onClick, disabled }: ModerationButtonProps) {
  return (
    <button
      className="cm-report-modal-reject"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      Отклонить
    </button>
  );
}

export function ReportAcceptButton({ onClick, disabled }: ModerationButtonProps) {
  return (
    <button
      className="cm-report-modal-accept"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      Принять
    </button>
  );
}

export function EventDeleteCancelButton({ onClick, disabled }: ModerationButtonProps) {
  return (
    <button
      className="cm-event-delete-cancel"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      Отмена
    </button>
  );
}

export function EventDeleteConfirmButton({ onClick, disabled }: ModerationButtonProps) {
  return (
    <button
      className="cm-event-delete-confirm"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      Удалить
    </button>
  );
}

interface NewsButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
}

export function CreateNewsButton({
  onClick,
  disabled,
  label = 'Создать новость',
}: NewsButtonProps) {
  return (
    <button
      className="cm-news-create-button"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      <span>{label}</span>

      <svg
        className="create-plus-icon"
        width="18"
        height="17"
        viewBox="0 0 18 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.53386 0V17M17.4233 8H0"
          stroke="#191919"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}

export function CreateNewsCloseButton({ onClick, disabled }: NewsButtonProps) {
  return (
    <button
      className="cm-create-news-close"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      ×
    </button>
  );
}

export function CreateNewsCancelButton({ onClick, disabled }: NewsButtonProps) {
  return (
    <button
      className="cm-create-news-cancel"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      Отмена
    </button>
  );
}

export function CreateNewsSubmitButton({ disabled }: NewsButtonProps) {
  return (
    <button
      className="cm-create-news-submit"
      type="submit"
      disabled={disabled}
    >
      {disabled ? 'Создание...' : 'Создать'}
    </button>
  );
}