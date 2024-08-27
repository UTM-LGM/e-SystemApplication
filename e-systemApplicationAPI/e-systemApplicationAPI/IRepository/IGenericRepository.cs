namespace e_systemApplicationAPI.IRepository
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        //To return as List
        Task<List<TEntity>> GetAll();
        Task<TEntity> Add(TEntity entity);
        Task<TEntity> Update(TEntity entity);
    }
}
